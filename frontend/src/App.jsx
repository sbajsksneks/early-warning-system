import './App.css';
import './output.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Datas from './pages/Datas';
import Info from './pages/Info';
import PantauData from './pages/PantauData';
import UploadBerkas from './pages/UploadBerkas';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Dashboard />} />
        <Route path='/datas' element={<Datas />} />
        <Route path='/info-upload' element={<Info />} />
        <Route path='/data/pantau' element={<PantauData />} />
        <Route path='/upload' element={<UploadBerkas />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
