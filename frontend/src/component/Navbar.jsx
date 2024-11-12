import React from "react";
import { Link } from "react-router-dom";


export default function Navbar() {
    const url = location.pathname;

    return ( 
        <nav className="bg-main  border-b-2 flex flex-col w-full">
            <div className="flex p-8 px-16 text-[24px] font-semibold">
                <div className="max-w-md">
                    <h1 className="blue-dark">EarlyWarning
                        <span className="yellow-wine">System</span>
                    </h1>
                    <p className="blue-dark mt-2 uppercase font-semibold text-sm">System informasi Peringatan Dini Kebutuhan Pokok Pangan Masyarakat di daerah Cirebon, Sumber.</p>
                </div>

            </div>

            {/* <div className="py-1 flex items-end justify-end px-8  border-t-2 border-b-2">
            <div className="flex justify-end py-3 gap-4 font-semibold blue-dark text-sm w-full">
                <Link to={'/'}>Home</Link>
                <Link to={'/upload'}>Upload Berkas</Link>
                <Link to={'/datas'}>Datas</Link>
                <Link to={'/info-upload'}>Petunjuk Upload</Link>
            </div>
        </div> */}
        </nav>
    );
}