import express from 'express';
import { fileupload, getData, getJsonContent, getWeeklyData, calculateAverageAcrossMarkets, DeleteFileJson } from '../controllers/data.controller.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Definisikan JSON_DIR
const JSON_DIR = path.join(process.cwd(), 'uploads', 'json');

router.post('/upload', fileupload);
router.get('/getdatas', getData);
router.post('/contents', getJsonContent);
// router.get('/content/:fileName', getJsonContent);
router.get('/weekly/:fileName', getWeeklyData);
router.delete('/content/:fileName', DeleteFileJson);

// Endpoint untuk testing multiple markets
router.get('/test/markets', async (req, res) => {
  try {
    // Baca semua file di direktori JSON
    const files = await fs.readdir(JSON_DIR);
    console.log('Files found:', files); // Debugging

    // Filter hanya file JSON
    const jsonFiles = files.filter(file => file.endsWith('.json'));
    console.log('JSON files:', jsonFiles); // Debugging
    
    if (jsonFiles.length === 0) {
      return res.status(404).json({ 
        message: "Tidak ada file JSON yang ditemukan",
        path: JSON_DIR 
      });
    }

    // Baca semua file JSON
    const allData = await Promise.all(
      jsonFiles.map(async file => {
        const filePath = path.join(JSON_DIR, file);
        console.log('Reading file:', filePath); // Debugging
        const content = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(content);
      })
    );

    console.log(`Successfully read ${allData.length} market data`); // Debugging

    const result = calculateAverageAcrossMarkets(allData);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: error.message,
      path: JSON_DIR,
      stack: error.stack 
    });
  }
});

export default router;