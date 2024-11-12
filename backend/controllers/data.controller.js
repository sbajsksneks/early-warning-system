import xlsx from 'xlsx';
import fs from 'fs/promises';
import path from 'path';

// Buat folder untuk menyimpan file JSON jika belum ada
const JSON_DIR = path.join(process.cwd(), 'uploads', 'json');
await fs.mkdir(JSON_DIR, { recursive: true });

export const fileupload = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ 
                message: "Mohon sertakan file yang akan diunggah" 
            });
        }

        const excelFile = req.files.file;
        
        // Baca file Excel
        const workbook = xlsx.read(excelFile.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Ambil metadata dengan pengecekan cell A1-A3
        let metadata = {
            bulan: "Tidak diketahui",
            tahun: new Date().getFullYear()
        };

        // Cek cell A1 sampai A3
        for (let i = 1; i <= 3; i++) {
            const cellRef = `A${i}`;
            if (worksheet[cellRef] && worksheet[cellRef].v) {
                const titleMatch = worksheet[cellRef].v.match(/Bulan (\w+) (\d{4})/);
                if (titleMatch) {
                    metadata = {
                        bulan: titleMatch[1],
                        tahun: parseInt(titleMatch[2])
                    };
                    break; // Keluar dari loop jika sudah menemukan metadata
                }
            }
        }

        // Konversi ke JSON dengan format yang diinginkan
        const rawData = xlsx.utils.sheet_to_json(worksheet, {
            raw: true,
            defval: null,
            blankrows: false,
            range: 3 // Mulai dari baris keempat (skip 3 baris pertama)
        });

        // Transformasi data ke format yang diinginkan
        const formattedData = rawData.map(row => {
            // Buat objek harga_harian
            const harga_harian = {};
            for (let i = 1; i <= 30; i++) {
                harga_harian[i.toString()] = row[i.toString()] || null;
            }

            return {
                Komoditas: row.Komoditas,
                harga_harian,
                Terendah: row.Terendah || null,
                Tertinggi: row.Tertinggi || null,
                "Rata-rata": row["Rata-rata"] || null
            };
        });

        // Buat struktur JSON final
        const jsonContent = {
            metadata,
            data: formattedData
        };

        // Buat nama file dengan timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileName = `data_${timestamp}.json`;
        const filePath = path.join(JSON_DIR, fileName);

        // Simpan ke file
        await fs.writeFile(filePath, JSON.stringify(jsonContent, null, 2));

        console.log('File JSON berhasil disimpan:', fileName);
        console.log('Metadata:', metadata);
        console.log('Jumlah data:', formattedData.length);

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
        // Baca semua file dalam direktori JSON
        const files = await fs.readdir(JSON_DIR);
        
        // Filter hanya file .json dan urutkan berdasarkan waktu pembuatan (terbaru dulu)
        const jsonFiles = await Promise.all(
            files
                .filter(file => file.endsWith('.json'))
                .map(async (file) => {
                    const filePath = path.join(JSON_DIR, file);
                    const stats = await fs.stat(filePath);
                    return {
                        fileName: file,
                        timestamp: stats.birthtime.toISOString(),
                        path: filePath
                    };
                })
        );

        // Urutkan file berdasarkan timestamp terbaru
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

function calculateWeeklyStats(weekPrices) {
  if (weekPrices.length === 0) return { avg: 0, kvh: 0 };
  
  // Hitung rata-rata (AVG)
  const avg = weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length;
  
  // Hitung standar deviasi (SDV)
  const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
  const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
  const stdDev = Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1));
  
  // Hitung KVH = (SDV/AVG) * 100
  const kvh = (stdDev / avg) * 100;
  
  return {
    avg: Math.round(avg),
    kvh: parseFloat(kvh.toFixed(2))
  };
}

function transformDataForPantau(jsonData) {
  const { metadata, data } = jsonData;
  const weekCount = 4;
  const daysPerWeek = 7;
  
  const transformedData = {
    type: "Minggu",
    startDate: `01-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`,
    endDate: `${new Date(metadata.tahun, getMonthNumber(metadata.bulan), 0).getDate()}-${metadata.bulan.substring(0, 3)}-${metadata.tahun}`,
    countLength: weekCount,
    detail_bulan: Array(weekCount).fill(metadata.bulan),
    datas: data.map(item => {
      return {
        Nama_pangan: item.Komoditas,
        details: Array.from({ length: weekCount }, (_, weekIndex) => {
          const weekStart = weekIndex * daysPerWeek + 1;
          const weekEnd = Math.min(weekStart + 6, 30);
          const weekPrices = Object.entries(item.harga_harian)
            .filter(([day, price]) => {
              const dayNum = parseInt(day);
              return dayNum >= weekStart && 
                     dayNum <= weekEnd && 
                     price !== null && 
                     price !== undefined;
            })
            .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

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
  const weeklyAverageKVH = Array(weekCount).fill(0).map((_, weekIndex) => {
    const kvhValues = transformedData.datas
      .map(item => item.details[weekIndex].Kvh)
      .filter(kvh => !isNaN(kvh) && kvh !== null);
    
    const avgKvh = kvhValues.length > 0 
      ? kvhValues.reduce((sum, kvh) => sum + kvh, 0) / kvhValues.length 
      : 0;
    
    return parseFloat(avgKvh.toFixed(2));
  });

  // Tambahkan KVH rata-rata ke response
  transformedData.weeklyAverageKVH = weeklyAverageKVH;

  return transformedData;
}

// Export functions
export const getJsonContent = async (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(JSON_DIR, fileName);

    const fileContent = await fs.readFile(filePath, 'utf-8');
    const jsonContent = JSON.parse(fileContent);

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
              return dayNum >= weekStart && 
                     dayNum <= weekEnd && 
                     price !== null;
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
          (data
            .map(item => {
              const weekPrices = Object.entries(item.harga_harian)
                .filter(([day, price]) => {
                  const dayNum = parseInt(day);
                  return dayNum >= weekStart && 
                         dayNum <= weekEnd && 
                         price !== null;
                })
                .map(([_, price]) => parseFloat(price.replace(/\./g, '')));

              const avg = weekPrices.length > 0 
                ? weekPrices.reduce((sum, price) => sum + price, 0) / weekPrices.length 
                : 0;
              const squaredDiffs = weekPrices.map(price => Math.pow(price - avg, 2));
              const sumSquaredDiffs = squaredDiffs.reduce((sum, diff) => sum + diff, 0);
              const stdDev = weekPrices.length > 1 
                ? Math.sqrt(sumSquaredDiffs / (weekPrices.length - 1))
                : 0;
              return avg > 0 ? (stdDev / avg) * 100 : 0;
            })
            .reduce((sum, kvh) => sum + kvh, 0) / data.length
          ).toFixed(2)
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