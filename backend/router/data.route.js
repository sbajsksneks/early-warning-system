import express from 'express';
import { fileupload, getData, getJsonContent, getWeeklyData } from '../controllers/data.controller.js';

const router = express.Router();

router.post('/upload', fileupload);
router.get('/getdatas', getData);
// router.get('/content/:fileName', getJsonContent);
router.post('/contents', getJsonContent);
router.get('/weekly/:fileName', getWeeklyData);

export default router;