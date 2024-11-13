import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../component/Navbar";
import Side from "../component/Side";

export default function UploadBerkas() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState(null);

    const handleChangeFile = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile && !selectedFile.name.match(/\.(xlsx|xls)$/)) {
            setError('Mohon upload file Excel (.xlsx atau .xls)');
            return;
        }

        setFile(selectedFile);
        setFileName(selectedFile?.name);
        setError(null);
    }

    const handleSubmit = async () => {
        if (!file) {
            setError('Mohon pilih file terlebih dahulu');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();

            formData.append('file', file);
            formData.append('lokasi_pasar', location)
            formData.append('tanggal', month);
            // console.log('oke')

            const response = await fetch('/api/data/upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Terjadi kesalahan saat upload file');
            }

            alert('File berhasil diupload!');
            navigate('/datas');
            // navigate('/data/pantau');

        } catch (err) {
            setError(err.message || 'Terjadi kesalahan saat upload file');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[100vh]">
            <Navbar />

            <div className="flex bg-main">
                <Side />

                <div className="flex flex-col gap-3 m-8 max-w-lg min-w-lg blue-dark">
                    <h1 className="text-2xl font-bold">Upload Berkas</h1>
                    <p>Mulai Upload Berkas Excel pada system kami.</p>
                    <p>*Pastikan format Excel sudah sesuai dengan kriteria yang kami rancang. kamu bisa melihat contohnya <Link className="yellow-wine a">disini</Link>
                    </p>

                    <div className="flex gap-3 items-center">
                        <span className="blue-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="#073b4c" d="M10.115 21.811c.606.5 1.238.957 1.885 1.403a27 27 0 0 0 1.885-1.403a28 28 0 0 0 2.853-2.699C18.782 16.877 21 13.637 21 10a9 9 0 1 0-18 0c0 3.637 2.218 6.876 4.262 9.112a28 28 0 0 0 2.853 2.7M12 13.25a3.25 3.25 0 1 1 0-6.5a3.25 3.25 0 0 1 0 6.5" /></svg>
                        </span>
                        <select onChange={(e) => setLocation(e.target.value)} required className="bg-input text-gray w-full py-3 rounded-md px-4" name="" id="">
                            <option value="" selected disabled>Pilih Lokasi Pasar</option>
                            <option value="Sumber">Pasar Sumber</option>
                            <option value="Pasalaran">Pasar Pasalaran</option>
                            <option value="Jamblang">Pasar Jamblang</option>
                            <option value="Palimanan">Pasar Palimanan</option>
                            <option value="Cipeujeuh">Pasar Cipeujeuh</option>
                            <option value="Babakan">Pasar Babakan</option>
                            <option value="Ciledug">Pasar Ciledug</option>
                        </select>
                    </div>
                   
                    <div className="flex gap-3 items-center">
                        <span className="blue-dark">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                                <g fill="currentColor">
                                    <path d="m12 2l.117.007a1 1 0 0 1 .876.876L13 3v4l.005.15a2 2 0 0 0 1.838 1.844L15 9h4l.117.007a1 1 0 0 1 .876.876L20 10v9a3 3 0 0 1-2.824 2.995L17 22H7a3 3 0 0 1-2.995-2.824L4 19V5a3 3 0 0 1 2.824-2.995L7 2z" />
                                    <path d="M19 7h-4l-.001-4.001z" />
                                </g>
                            </svg>
                        </span>
                        <input
                            id="file"
                            type="file"
                            hidden
                            onChange={handleChangeFile}
                            accept=".xlsx,.xls"
                        />
                        <label htmlFor="file" className="w-full cursor-pointer">
                            {file ? (
                                <p>File {fileName} berhasil dipilih. ingin <label htmlFor="file" className="a cursor-pointer">ganti?</label></p>
                            ) : (
                                <div className="bg-input text-gray py-3 rounded-md px-4">
                                    Upload berkas disini..
                                </div>
                            )}
                        </label>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* <div className="flex flex-col"> */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 36 36"><path fill="currentColor" d="M32.25 6h-4v3a2.2 2.2 0 1 1-4.4 0V6H12.2v3a2.2 2.2 0 0 1-4.4 0V6h-4A1.78 1.78 0 0 0 2 7.81v22.38A1.78 1.78 0 0 0 3.75 32h28.5A1.78 1.78 0 0 0 34 30.19V7.81A1.78 1.78 0 0 0 32.25 6M10 26H8v-2h2Zm0-5H8v-2h2Zm0-5H8v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Zm6 10h-2v-2h2Zm0-5h-2v-2h2Zm0-5h-2v-2h2Z" class="clr-i-solid clr-i-solid-path-1" /><path fill="currentColor" d="M10 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-solid clr-i-solid-path-2" /><path fill="currentColor" d="M26 10a1 1 0 0 0 1-1V3a1 1 0 0 0-2 0v6a1 1 0 0 0 1 1" class="clr-i-solid clr-i-solid-path-3" /><path fill="none" d="M0 0h36v36H0z" /></svg>


                        <input
                            type="month"
                            data-aos="fade-left"
                            // selectsRange
                            // startDate={startDate}
                            // endDate={endDate}
                            // onChange={(dates) => {
                            //     const [start, end] = dates;
                            //     setStartDate(start);
                            //     setEndDate(end);
                            // }}
                            // isClearable
                            onChange={(e) => setMonth(e.target.value)}
                            placeholderText='Filter berdasarkan waktu'
                            className="lg:p-3.5 p-3 md:pe-[10vw] pe-[30vw] bg-[#E7E7E7]/90 text-[#6C6C6C] font-[500] lg:mb-0 mb-4 rounded text-sm sm:me-0 me-3 md:text-[16px] lg:min-w-[20vw] md:w-fit w-full min-w-screen inline-block"
                        />

                        {/* </div> */}

                        {/* <select name="" id="" className="ms-3 font-semibold rounded-md px-4 py-3 bg-input text-gray lg:min-w-[320px]">
                            <option value="mingguan" selected>Filter Mingguan</option>
                            <option value="bulanan" selected>Filter Bulanan</option>
                        </select> */}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || !file}
                        className={`flex mt-3 font-semibold w-fit gap-2 rounded-md 
                            ${loading || !file ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 active:opacity-80'} 
                            blue-dark bg-yellow-wine px-4 py-3`}
                    >
                        {loading ? (
                            "Mengupload..."
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M10 16h4c.55 0 1-.45 1-1v-5h1.59c.89 0 1.34-1.08.71-1.71L12.71 3.7a.996.996 0 0 0-1.41 0L6.71 8.29c-.63.63-.19 1.71.7 1.71H9v5c0 .55.45 1 1 1m-4 2h12c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1" />
                                </svg>
                                Mulai Upload File
                            </>
                        )}
                    </button>

                    
                </div>
            </div>
        </div>
    );
}