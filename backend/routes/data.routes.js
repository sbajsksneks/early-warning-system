import express from 'express';
import { getWeeklyData } from '../controllers/data.controller.js';

const router = express.Router();

// ... route lainnya ...

router.get('/weekly/:fileName', getWeeklyData);

export default router; 