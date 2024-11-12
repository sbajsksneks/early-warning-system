import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../component/Navbar";
import Side from "../component/Side";

export default function PantauData() {

    const [rataKVH, setRataKVH] = useState([]);
    const [recomendations, setRecomendations] = useState([]);
    const [isPrint, setIsPrint] = useState(false);

    const datas = {
        "type": "Minggu",
        "startDate": "13-05-2024",
        "endDate": "13-06-2024",
        "countLength": 4, // contoh apbila, ada 4 minggu
        "detail_bulan": ["Agustus", "Agustus", "September", "September"],
        // contoh minngu pertama masi dibulan Agustus, di minggu terakhir bulan November
        "datas": [
            {
                "Nama_pangan": "Beras Jagung",
                "details": [
                    {
                        "title": "Minggu 1",
                        "Avg_rupiah": 13000,
                        "Kvh": 2.3
                    },
                    {
                        "title": "Minggu 2",
                        "Avg_rupiah": 14000,
                        "Kvh": 6.7
                    },
                    {
                        "title": "Minggu 3",
                        "Avg_rupiah": 12500,
                        "Kvh": 4.5
                    },
                    {
                        "title": "Minggu 4",
                        "Avg_rupiah": 13500,
                        "Kvh": 3.8
                    }
                ]
            },
            {
                "Nama_pangan": "Nasi Pandan",
                "details": [
                    {
                        "title": "Minggu 1",
                        "Avg_rupiah": 15000,
                        "Kvh": 3.1
                    },
                    {
                        "title": "Minggu 2",
                        "Avg_rupiah": 15500,
                        "Kvh": 5.4
                    },
                    {
                        "title": "Minggu 3",
                        "Avg_rupiah": 14800,
                        "Kvh": 4.2
                    },
                    {
                        "title": "Minggu 4",
                        "Avg_rupiah": 16000,
                        "Kvh": 6.0
                    }
                ]
            },
            {
                "Nama_pangan": "Ketela Pohon",
                "details": [
                    {
                        "title": "Minggu 1",
                        "Avg_rupiah": 7000,
                        "Kvh": 1.5
                    },
                    {
                        "title": "Minggu 2",
                        "Avg_rupiah": 7500,
                        "Kvh": 2.1
                    },
                    {
                        "title": "Minggu 3",
                        "Avg_rupiah": 7200,
                        "Kvh": 1.8
                    },
                    {
                        "title": "Minggu 4",
                        "Avg_rupiah": 7700,
                        "Kvh": 2.5
                    }
                ]
            },
            {
                "Nama_pangan": "Ubi Jalar",
                "details": [
                    {
                        "title": "Minggu 1",
                        "Avg_rupiah": 9000,
                        "Kvh": 2.9
                    },
                    {
                        "title": "Minggu 2",
                        "Avg_rupiah": 9400,
                        "Kvh": 3.3
                    },
                    {
                        "title": "Minggu 3",
                        "Avg_rupiah": 9100,
                        "Kvh": 2.7
                    },
                    {
                        "title": "Minggu 4",
                        "Avg_rupiah": 9700,
                        "Kvh": 3.5
                    }
                ]
            },
            {
                "Nama_pangan": "Gandum",
                "details": [
                    {
                        "title": "Minggu 1",
                        "Avg_rupiah": 18000,
                        "Kvh": 4.0
                    },
                    {
                        "title": "Minggu 2",
                        "Avg_rupiah": 18500,
                        "Kvh": 4.8
                    },
                    {
                        "title": "Minggu 3",
                        "Avg_rupiah": 18200,
                        "Kvh": 4.5
                    },
                    {
                        "title": "Minggu 4",
                        "Avg_rupiah": 19000,
                        "Kvh": 5.1
                    }
                ]
            }
        ]
    };


    useEffect(() => {
        const rata_rata_kvh = HitungRataKVH(datas.datas, datas.countLength);
        setRataKVH(rata_rata_kvh);

        console.log({ rata_rata_kvh })
    }, [])

    const handleDateFormat = (date) => {
        const [d, m, y] = date.split('-');
        return new Date(`${y}-${m}-${d}`);
    }

    useEffect(() => {
        console.log({ recomendations });
    }, [recomendations])

    function handleInputChange(e, name) {
        e.preventDefault();
        setRecomendations(prevState => ({
            ...prevState,
            [name]: e.target.value
        }));
    }

    const printLayar = async () => {
        if (Object.keys(recomendations).length == datas.datas.length + 1) {
            setIsPrint(true);
            // console.log("oke valid");
            // await new Promise(setTimeout())
            setTimeout(() => {
                window.print();
            }, 2000)
        }

    }

    return (
        <div className="min-h-[100vh]">
            <div className="flex bg-main">

                {/* your content here */}
                <div className="flex flex-col gap-3 m-16 blue-dark">

                    <h1 className="text-[24px] font-bold">EarlyWarning<span className="yellow-wine">System</span></h1>

                    <p className="py-2 max-w-2xl font-semibold text-sm uppercase">
                        SISTEM PERINGATAN DINI KEBUTUHAN POKOK MASYARAKAT EARLY WARNING SYSTEM (ERWAS) KEPOKMAS
                    </p>

                    <div className="text-sm font-semibold">
                        TANGGAL : {new Intl.DateTimeFormat('id-ID', {
                            year: 'numeric',
                            month: "long",
                            day: "2-digit"
                        }).format(handleDateFormat(datas.startDate))} -

                        {new Intl.DateTimeFormat('id-ID', {
                            year: 'numeric',
                            month: "long",
                            day: "2-digit"
                        }).format(handleDateFormat(datas.endDate))}
                    </div>
                    <div className="text-sm font-semibold">
                        PERIODE : {datas && datas.type == "Minggu" ? "Mingguan" : "Bulanan"}
                    </div>

                    <p className="font-bold no-print">Berikan Rekomendasi Aksi Yang Tepat Menurut Analisa anda</p>
                    <p className="no-print text-red-600"> <span className="text-red-600">* </span>lengkapi semua aksi rekomendasi untuk mengeprint.</p>


                    <table className="w-full min-w-screen rounded-md" >
                        <thead className="bg-blue-dark text-white rounded-md text-xs font-medium border-2 border-black" style={{ borderRadius: 5 + 'px' }}>
                            {/* <tr className="w-full text-white bg-blue-dark rounded-md">
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">File Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Extension file</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ketersedian</th>
                            </tr> */}
                            <td className="border border-gray-400 px-3 py-2">No.</td>
                            <td className="border border-gray-400 px-3 py-2">Jenis Bahan Pokok</td>

                            {Array.from({ length: datas.countLength }).map((_val, _i) => (
                                <>
                                    <td className="border border-gray-400 px-3 py-2">{datas.type} {_i + 1} Bulan {datas.detail_bulan[_i]}- AVG (Rp.)</td>
                                    <td className="border border-gray-400 px-3 py-2">{datas.type} {_i + 1} Bulan {datas.detail_bulan[_i]}- Kvh</td>
                                </>
                            ))}
                            {/* <th className="border border-gray-400 px-3 py-2">Minggu 2 - AVG (Rp.)</th>
                            <th className="border border-gray-400 px-3 py-2">Minggu 2 - Kvh</th> */}
                            <td className="border border-gray-400 px-3 py-2 space-nowrap">Rekomendasi Aksi</td>
                        </thead>
                        <tbody className="text-xs lg:text-xs font-medium border-2 border-black">
                            {datas.datas.length > 0 ? (
                                datas.datas.map((val, _i) => {
                                    // !_i < datas.countLength ? return null :  return true;
                                    return (
                                        <tr className={_i % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                            <th className="px-6 border-[#073B4C] border py-3 whitespace-nowrap">
                                                {_i + 1}
                                            </th>
                                            <th className="border-[#073B4C] border px-6 py-3 whitespace-nowrap">
                                                {datas.datas[_i]['Nama_pangan']}
                                            </th>
                                            {Array.from({ length: datas.datas[_i]['details'].length }).map((_val, __i) => (

                                                <HandleColorTd price={datas.datas[_i]['details'][__i]['Avg_rupiah']} kvh={datas.datas[_i]['details'][__i]['Kvh']} />

                                            ))}

                                            <td className="px-6 py-3 whitespace-nowrap border-[#073B4C] border text-sm">
                                                {isPrint ? (
                                                    recomendations[val.Nama_pangan]
                                                ) : (
                                                    <input type="text" className="border-[#073B4C] border bg-white text-gray rounded-sm text-xs py-2 px-3" onChange={() => handleInputChange(event, val.Nama_pangan)} />
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : null}

                            <tr className={datas.datas.length % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                <td colSpan={2} className="px-6 uppercase font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                                    KVH RATA RATA {datas.type == "Minggu" ? "Mingguan" : "Bulanan"}
                                </td>

                                {rataKVH.length > 0 ? (
                                    rataKVH.map((kvh) => (
                                        <HandleColorAverage kvh={kvh} />
                                    ))
                                ) : null}

                                <td className="px-6 py-2 whitespace-nowrap border-[#073B4C] border">
                                    {isPrint ? (
                                        recomendations["rata_rata"]
                                    ) : (

                                        <input type="text" className="text-xs border-[#073B4C] border bg-white text-gray rounded-sm py-2 px-3" onChange={() => handleInputChange(event, "rata_rata")} />
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {datas && Object.keys(recomendations).length == datas.datas.length + 1 ? (
                        <button onClick={printLayar} type="submit" className="no-print flex mt-3 font-semibold w-fit gap-2 rounded-md hover:opacity-90 active:opacity-80 blue-dark bg-yellow-wine px-3 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" /></svg>
                            Submit dan Pantau Data
                        </button>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

function HandleColorTd({ price, kvh }) {
    if (kvh > 6) {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {price}
                </td>
                <td className="border-[#073B4C] bg-[#FF2C2C] border px-6 py-4 whitespace-nowrap">
                    {kvh}%
                </td>
            </>
        )
    } else if (kvh > 3) {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {price}
                </td>
                <td className="border-[#073B4C] bg-[#F4BB00] border px-6 py-4 whitespace-nowrap">
                    {kvh}%
                </td>
            </>
        )
    } else {
        return (
            <>
                <td className="border-[#073B4C] border px-6 py-4 whitespace-nowrap">
                    RP. {price}
                </td>
                <td className="border-[#073B4C] bg-[#20E45B] border px-6 py-4 whitespace-nowrap">
                    {kvh}%
                </td>
            </>
        )
    }
}

function HitungRataKVH(data, length) {

    let HasilKVH = [];

    if (data.length > 0) {
        // ambil data
        for (let j = 0; j < length; j++) {
            let totalKVH = 0;
            let index = 0;
            for (let i = 0; i < data.length; i++) {
                // for(let j = 0; j < data[i]['details'].length; j++){
                // }
                // dataKVH.push(data[i]['details'][j]['KVH']);
                console.log(data[i]['details'][j]['Kvh'], j, i);
                totalKVH += data[i]['details'][j]['Kvh'];

                // datas[0]["details"][0]
                index++;
            }

            let rata2KVH = totalKVH / index;
            HasilKVH.push(rata2KVH);
        }
    }

    HasilKVH = HasilKVH.map(kvh => parseFloat(kvh.toFixed(2)))
    return HasilKVH;
    /**
     * return
     * [
        4, 2.8, 3, 4.3
     * ]
     */
}

function HandleColorAverage({ kvh }) {
    if (kvh > 6) {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#FF2C2C] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh}%
            </td>
        )
    } else if (kvh > 3) {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#F4BB00] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh}%
            </td>
        )
    } else {
        return (
            <td colSpan={2} className="px-6 uppercase bg-[#20E45B] font-bold border-[#073B4C] border py-2 whitespace-nowrap">
                {kvh}%
            </td>
        )
    }
}


