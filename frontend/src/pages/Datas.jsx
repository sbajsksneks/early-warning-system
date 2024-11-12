import React, { useEffect, useState } from "react";

import Navbar from "../component/Navbar";
import Side from "../component/Side";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export default function Datas() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const datas = [
        {
            filedate: "20-08-2024",
            extension: ".json",
            ketersedian: true
        },
        {
            filedate: "20-10-2024",
            extension: ".json",
            ketersedian: true
        },
        {
            filedate: "21-10-2024",
            extension: ".json",
            ketersedian: true
        },
        {
            filedate: "22-10-2024",
            extension: ".json",
            ketersedian: true
        },
    ];


    return (
        <div className="min-h-[100vh]">
            <Navbar />

            <div className="flex bg-main">
                <Side />

                {/* your content here */}
                <div className="flex flex-col gap-3 m-8 max-w-xl blue-dark">

                    <h1 className="text-2xl font-bold">Data Akomoditas</h1>
                    <div className="flex">
                        <DatePicker
                            data-aos="fade-left"
                            selectsRange
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(dates) => {
                                const [start, end] = dates;
                                setStartDate(start);
                                setEndDate(end);
                            }}
                            isClearable
                            placeholderText='Filter berdasarkan waktu'
                            className="lg:p-3.5 p-3 md:pe-[10vw] pe-[30vw] bg-[#E7E7E7]/90 text-[#6C6C6C] font-[500] lg:mb-0 mb-4 rounded text-sm sm:me-0 me-3 md:text-[16px] lg:min-w-[320px] md:w-fit w-full min-w-screen inline-block"
                        />

                        <select name="" id="" className="ms-3 font-semibold rounded-md px-4 py-3 bg-input text-gray lg:min-w-[320px]">
                            <option value="mingguan" selected>Filter Mingguan</option>
                            <option value="bulanan" selected>Filter Bulanan</option>
                        </select>
                    </div>

                    <table className="w-full min-w-md rounded-md">
                        <thead className="bg-[#363636]/20 rounded-md">
                            <tr className="w-full text-white bg-blue-dark rounded-md">
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">File Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Extension file</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ketersedian</th>
                            </tr>
                        </thead>
                        <tbody className=" text-xs lg:text-sm font-semibold">
                            {datas.length > 0 ? (
                                datas.map((val, _i) => {
                                    return (
                                        <tr className={_i % 2 == 0 ? "bg-white1" : "bg-white2"}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {_i + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {datas[_i]['filedate']}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {datas[_i]['extension']}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {String(datas[_i]['ketersedian'])}
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : null}


                        </tbody>
                    </table>

                    <button type="submit" className="flex mt-3 font-semibold w-fit gap-2 rounded-md hover:opacity-90 active:opacity-80 blue-dark bg-yellow-wine px-4 py-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" /></svg>
                        Submit dan Pantau Data
                    </button>


                </div>
            </div>
        </div>
    );
}