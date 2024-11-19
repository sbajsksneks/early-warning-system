import xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';
import { readFile } from 'fs';

// Buat folder untuk menyimpan file JSON jika belum ada
const JSON_DIR = path.join(process.cwd(), 'uploads', 'json');
await fs.mkdir(JSON_DIR, { recursive: true });

const KOMODITAS_LIST = [
  "Beras Medium",
  "Beras Premium",
  "Bawang Merah",
  "Kacang Kedelai Lokal",
  "Kacang Kedelai Impor",
  "Cabe Merah Besar",
  "Cabe Merah Keriting",
  "Cabe Rawit Merah",
  "Cabe Rawit Hijau",
  "Minyak Goreng Sawit",
  "Tepung Terigu",
  "Gula Pasir",
  "Daging Ayam ras",
  "Telur Ayam Ras",
  "Daging Sapi",
  "Ikan Bandeng"
];

const KOMODITAS_MAPPING = {
  "Beras Medium": "Beras Medium",
  "Beras Premium": "Beras Premium I",
  "Bawang Merah": "Bawang Merah",
  "Kacang Kedelai Lokal": "Kacang Kedelai Lokal",
  "Kacang Kedelai Impor": "Kacang Kedelai Impor",
  "Cabe Merah Besar": "Cabe Merah Biasa",
  "Cabe Merah Keriting": "Cabe Merah Keriting",
  "Cabe Rawit Merah": "Cabe Rawit Merah",
  "Cabe Rawit Hijau": "Cabe Rawit Hijau",
  "Minyak Goreng Sawit": "Minyak Goreng Tropical",
  "Tepung Terigu": "Tepung Terigu Segi Tiga Biru",
  "Gula Pasir": "Gula Pasir lokal",
  "Daging Ayam ras": "Daging Ayam Broiler",
  "Telur Ayam Ras": "Telur Ayam Broiler",
  "Daging Sapi": "Daging Sapi Murni",
  "Ikan Bandeng": "Ikan Bandeng"
};

export const fileupload = async (req, res) => {
  try {
    const { lokasi_pasar, tanggal } = req.body;

    if (!req.files || !req.files.file) {
      return res.status(400).json({
        message: "Mohon sertakan file yang akan diunggah"
      });
    }

    const excelFile = req.files.file;
    const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Ambil semua data dari Excel tanpa filter
    const rawData = xlsx.utils.sheet_to_json(worksheet, {
      raw: true,
      defval: "0", // Set default value untuk cell kosong ke "0"
      blankrows: false,
      range: 3 // Mulai dari baris keempat (skip 3 baris pertama)
    });

    // Ambil metadata
    let metadata = {
      timestamp : `${tanggal}-01`,
      bulan: "Tidak diketahui",
      tahun: new Date().getFullYear(),
      lokasi_pasar: `Pasar ${lokasi_pasar}`
    };

    // Cek cell A1 sampai A3 untuk metadata
    for (let i = 1; i <= 3; i++) {
      const cellRef = `A${i}`;
      if (worksheet[cellRef] && worksheet[cellRef].v) {
        const titleMatch = worksheet[cellRef].v.match(/Bulan (\w+) (\d{4})/);
        if (titleMatch) {
          metadata.bulan = titleMatch[1];
          metadata.tahun = parseInt(titleMatch[2]);
          break;
        }
      }
    }

    // Fungsi untuk mendapatkan jumlah hari dalam bulan
    function getDaysInMonth(monthName, year) {
      const monthNumbers = {
        'Januari': 0, 'Februari': 1, 'Maret': 2, 'April': 3,
        'Mei': 4, 'Juni': 5, 'Juli': 6, 'Agustus': 7,
        'September': 8, 'Oktober': 9, 'November': 10, 'Desember': 11
      };
      const monthIndex = monthNumbers[monthName];
      return new Date(year, monthIndex + 1, 0).getDate();
    }

    const daysInMonth = getDaysInMonth(metadata.bulan, metadata.tahun);

    // Format data dengan mempertahankan semua komoditas
    const formattedData = rawData.map(row => {
      const harga_harian = {};
      for (let i = 1; i <= daysInMonth; i++) {
        harga_harian[i.toString()] = row[i.toString()] || "0";
      }

      return {
        Komoditas: row.Komoditas,
        harga_harian,
        Terendah: row.Terendah || "0",
        Tertinggi: row.Tertinggi || "0",
        "Rata-rata": row["Rata-rata"] || "0"
      };
    });

    // Buat struktur JSON final
    const jsonContent = {
      metadata,
      data: formattedData
    };

    const fileName = `data_${metadata.tahun}_${metadata.bulan}_${metadata.lokasi_pasar}.json`;
    const filePath = path.join(JSON_DIR, fileName);

    await fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2));

    console.log({tanggal});
    res.json({
      message: "Data berhasil dikonversi dan disimpan",
      fileName: fileName,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam proses konversi dan penyimpanan file",
      error: error.message
    });
  }
};

export const getData = async (req, res) => {
  try {
    const { date } = req.query;
    const files = await fs.readdir(JSON_DIR);

    const jsonFiles = await Promise.all(
      files
        .filter(file => {
          if (date) {
            const [year, month] = date.split('-');
            // Convert month number to name in Indonesian
            const monthNames = {
              '01': 'Januari',
              '02': 'Februari',
              '03': 'Maret',
              '04': 'April',
              '05': 'Mei',
              '06': 'Juni',
              '07': 'Juli',
              '08': 'Agustus',
              '09': 'September',
              '10': 'Oktober',
              '11': 'November',
              '12': 'Desember'
            };
            
            const monthName = monthNames[month];
            // Check if filename contains both year and month
            return file.includes(`data_${year}_${monthName}`) && file.endsWith('.json');
          }
          return file.endsWith('.json');
        })
        .map(async (file) => {
          const filePath = path.join(JSON_DIR, file);
          let data = await fs.readFile(filePath, 'utf-8');
          data = JSON.parse(data);
          const stats = await fs.stat(filePath);
          return {
            fileName: file,
            timestamp: data.metadata.timestamp,
            path: filePath,
            location: data.metadata.lokasi_pasar
          };
        })
    );

    jsonFiles.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json(jsonFiles);
  } catch (error) {
    console.error('Terjadi kesalahan saat mengambil data:', error);
    res.status(500).json({
      message: "Terjadi kesalahan saat mengambil data",
      error: error.message
    });
  }
};

// Helper functions
function getMonthNumber(monthName) {
  const months = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  return months.indexOf(monthName);
}

function calculateKvh(price, average) {
  if (!price || !average) return 0;
  return parseFloat(((Math.abs(price - average) / average) * 100).toFixed(2));
}

// Helper functions for statistical calculations
function calculateAverage(prices) {
  if (prices.length === 0) return 0;
  return prices.reduce((sum, price) => sum + price, 0) / prices.length;
}

function calculateStandardDeviation(prices, average) {
  if (prices.length <= 1) return 0;
  const squaredDiffs = prices.map(price => Math.pow(price - average, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
  return Math.sqrt(sumSquaredDiffs / (prices.length - 1));
}

function calculateKVH(standardDeviation, average) {
  if (average === 0) return 0;
  return (standardDeviation / average) * 100;
}

function calculateWeeklyStats(weekPrices) {
  // Filter harga 0 sebelum perhitungan
  const validPrices = weekPrices.filter(price => price > 0);
  
  if (validPrices.length === 0) {
    return {
      avg: 0,
      sdv: 0,
      kvh: 0
    };
  }

  // Calculate Average (AVG)
  const avg = calculateAverage(validPrices);
  
  // Calculate Standard Deviation (SDV)
  const stdDev = calculateStandardDeviation(validPrices, avg);
  
  // Calculate KVH
  const kvh = calculateKVH(stdDev, avg);

  return {
    avg: Math.round(avg),
    sdv: parseFloat(stdDev.toFixed(2)),
    kvh: parseFloat(kvh.toFixed(2))
  };
}

// Fungsi helper untuk normalisasi string
function normalizeString(str) {
  return str.toLowerCase().replace(/\s+/g, ' ').trim();
}

function transformDataForPantau(jsonData) {
  const { metadata, data } = jsonData;
  const weekCount = 4;
  const daysPerWeek = 7;

  const transformedData = {
    type: "Minggu",
    location: metadata.lokasi_pasar,
    startDate: `01-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`,
    endDate: `${new Date(metadata.tahun, getMonthNumber(metadata.bulan), 0).getDate()}-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`,
    countLength: weekCount,
    detail_bulan: Array(weekCount).fill(metadata.bulan),
    datas: KOMODITAS_LIST.map(komoditas => {
      // Gunakan mapping untuk mencari data yang sesuai
      const excelKomoditas = KOMODITAS_MAPPING[komoditas];
      const item = data.find(d => 
        normalizeString(d.Komoditas) === normalizeString(excelKomoditas)
      );
      
      if (!item) {
        console.log(`Data tidak ditemukan untuk komoditas: ${komoditas} (${excelKomoditas})`);
      }

      return {
        Nama_pangan: komoditas,
        details: Array.from({ length: weekCount }, (_, weekIndex) => {
          if (!item) {
            return {
              title: `Minggu ${weekIndex + 1}`,
              Avg_rupiah: 0,
              Kvh: 0
            };
          }

          const weekStart = weekIndex * daysPerWeek + 1;
          const weekEnd = Math.min(weekStart + 6, 30);
          const weekPrices = Object.entries(item.harga_harian)
            .filter(([day, price]) => {
              const dayNum = parseInt(day);
              const priceNum = parseFloat(String(price).replace(/\./g, ''));
              // Filter berdasarkan range hari dan harga tidak 0
              return dayNum >= weekStart && 
                     dayNum <= weekEnd && 
                     priceNum > 0; // Hanya ambil harga yang lebih dari 0
            })
            .map(([_, price]) => parseFloat(String(price).replace(/\./g, '')));

          const { avg: Avg_rupiah, kvh: Kvh } = calculateWeeklyStats(weekPrices);

          return {
            title: `Minggu ${weekIndex + 1}`,
            Avg_rupiah,
            Kvh
          };
        })
      };
    })
  };

  // Hitung KVH rata-rata mingguan
  transformedData.weeklyAverageKVH = Array(weekCount).fill(0).map((_, weekIndex) => {
    // Ambil hanya komoditas yang memiliki data valid (harga > 0) untuk minggu tersebut
    const validKomoditas = transformedData.datas.filter(item => {
      const weekPrices = Object.entries(item.details[weekIndex])
        .filter(([key, value]) => key === 'Avg_rupiah' && value > 0);
      return weekPrices.length > 0;
    });

    // Ambil nilai KVH dari komoditas yang valid
    const kvhValues = validKomoditas
      .map(item => item.details[weekIndex].Kvh)
      .filter(kvh => !isNaN(kvh) && kvh > 0);

    // Jika tidak ada komoditas yang valid, return 0
    if (kvhValues.length === 0) return 0;

    // Hitung rata-rata KVH hanya dari komoditas yang memiliki data
    return parseFloat((kvhValues.reduce((sum, kvh) => sum + kvh, 0) / kvhValues.length).toFixed(2));
  });

  return transformedData;
}

// Export functions
export const getJsonContent = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);
    console.log({fileContent});

    const transformedData = transformDataForPantau(jsonContent);

    res.json(transformedData);

  } catch (error) {
    console.error('Terjadi kesalahan saat membaca file JSON:', error);
    res.status(500).json({
      message: "Terjadi kesalahan saat membaca file JSON",
      error: error.message
    });
  }
};

export const getWeeklyData = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    // Menggunakan fungsi transformDataForPantau yang sudah ada
    const transformedData = transformDataForPantau(jsonContent);

    res.json(transformedData);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam proses pengambilan data mingguan",
      error: error.message
    });
  }
};

export const getDetailedStats = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

    const detailedStats = calculateDetailedStats(jsonContent);
    res.json(detailedStats);
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    res.status(500).json({
      message: "Terjadi kesalahan dalam mengambil statistik detail",
      error: error.message
    });
  }
};

function calculateDetailedStats(jsonContent) {
  const { metadata, data } = jsonContent;
  const weekCount = 4;
  const daysPerWeek = 7;

  return {
    type: "Minggu",
    metadata: {
      bulan: metadata.bulan,
      tahun: metadata.tahun
    },
    weeklyStats: Array.from({ length: weekCount }, (_, weekIndex) => {
      const weekStart = weekIndex * daysPerWeek + 1;
      const weekEnd = Math.min(weekStart + 6, 30);

      return {
        weekNumber: weekIndex + 1,
        period: `${weekStart} - ${weekEnd} ${metadata.bulan}`,
        commodities: data.map(item => {
          const weekPrices = Object.entries(item.harga_harian)
            .filter(([day, price]) => {
              const dayNum = parseInt(day);
              const priceNum = parseFloat(String(price).replace(/\./g, ''));
              return dayNum >= weekStart &&
                     dayNum <= weekEnd &&
                     priceNum > 0; // Hanya ambil harga yang lebih dari 0
            })
            .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

          // Hitung statistik
          const avg = weekPrices.length > 0
            ? weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length
            : 0;

          const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
          const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
          const stdDev = weekPrices.length > 1
            ? Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1))
            : 0;

          const kvh = avg > 0 ? (stdDev / avg) * 100 : 0;

          return {
            komoditas: item.Komoditas,
            harga_harian: weekPrices,
            statistik: {
              avg: Math.round(avg),
              sdv: parseFloat(stdDev.toFixed(2)),
              kvh: parseFloat(kvh.toFixed(2))
            }
          };
        }),
        averageKVH: parseFloat(
          ((() => {
            // Filter komoditas yang memiliki data valid untuk minggu ini
            const validCommodities = data.filter(item => {
              const weekPrices = Object.entries(item.harga_harian)
                .filter(([day, price]) => {
                  const dayNum = parseInt(day);
                  const priceNum = parseFloat(String(price).replace(/\./g, ''));
                  return dayNum >= weekStart && 
                         dayNum <= weekEnd && 
                         priceNum > 0;
                });
              return weekPrices.length > 0;
            });

            // Jika tidak ada komoditas valid, return 0
            if (validCommodities.length === 0) return 0;

            // Hitung KVH hanya untuk komoditas yang valid
            const validKvhValues = validCommodities
              .map(item => {
                const weekPrices = Object.entries(item.harga_harian)
                  .filter(([day, price]) => {
                    const dayNum = parseInt(day);
                    const priceNum = parseFloat(String(price).replace(/\./g, ''));
                    return dayNum >= weekStart && dayNum <= weekEnd && priceNum > 0;
                  })
                  .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

                const avg = weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length;
                const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
                const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
                const stdDev = Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1));
                return (stdDev / avg) * 100;
              })
              .filter(kvh => kvh > 0);

            // Hitung rata-rata KVH dari nilai yang valid
            return validKvhValues.reduce((sum, kvh) => sum + kvh, 0) / validKvhValues.length;
          })()).toFixed(2)
        )
      };
    }),
    monthlyStats: data.map(item => {
      const allPrices = Object.values(item.harga_harian)
        .filter(price => price !== null)
        .map(price => parseFloat(price.replace(/\./g, '')));

      const avg = allPrices.length > 0
        ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
        : 0;

      const squaredDiffs = allPrices.map(price => Math.pow(price - avg, 2));
      const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
      const stdDev = allPrices.length > 1
        ? Math.sqrt(sumSquaredDiffs / (allPrices.length - 1))
        : 0;

      const kvh = avg > 0 ? (stdDev / avg) * 100 : 0;

      return {
        komoditas: item.Komoditas,
        statistik: {
          avg: Math.round(avg),
          sdv: parseFloat(stdDev.toFixed(2)),
          kvh: parseFloat(kvh.toFixed(2))
        }
      };
    })
  };
}