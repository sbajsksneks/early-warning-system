import React from "react";

import Navbar from "../component/Navbar";
import Side from "../component/Side";
import { Link } from "react-router-dom";

export default function Dashboard() {

    return (
        <div className="min-h-[100vh]">
            <Navbar />

            <div className="flex bg-main">
                <div  className="bg-main min-h-[80vh] w-[20%] font-semibold border-r pt-5 hidden md:flex flex-col text-sm justify-between">
                    <Side />
                </div>

                {/* your content here */}
                <div className="flex flex-col gap-3 md:mx-16 m-8 md:my-8 max-w-xl blue-dark">


                    <h1 className="text-2xl font-bold">Home</h1>
                    <p>
                        Halo selamat datang, EarlyWarning Sistem adalah aplikasi web sederhana yang dapat memantau, menghitung, dan mengklasifikasikan tingkat stabilitas harga kebutuhan pokok berdasarkan Koefisien Variasi Harga (KVH)</p>
                    <p>Pengguna dapat mengunggah file ( dalam format Excel ) yang berisi data harga komoditas pangan.
                    </p>


                    <div className="flex flex-col md:flex-row gap-3 mt-4">
                        <Link to={"/upload"} className="flex gap-2 font-semibold rounded-md hover:opacity-90 active:opacity-80 blue-dark bg-yellow-wine px-4 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" /></svg>
                            Mulai Upload File
                        </Link>
                        <Link to={"/datas"} className="flex gap-2 font-semibold rounded-md hover:opacity-90 active:opacity-80 text-white bg-blue-dark px-4 py-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M20 6c0-2.168-3.663-4-8-4S4 3.832 4 6v2c0 2.168 3.663 4 8 4s8-1.832 8-4zm-8 13c-4.337 0-8-1.832-8-4v3c0 2.168 3.663 4 8 4s8-1.832 8-4v-3c0 2.168-3.663 4-8 4" /><path fill="currentColor" d="M20 10c0 2.168-3.663 4-8 4s-8-1.832-8-4v3c0 2.168 3.663 4 8 4s8-1.832 8-4z" /></svg>
                            Lihat data yang tersedia
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}