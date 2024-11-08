import express from 'express';
import {fileupload, getData} from '../controllers/data.controller.js';

const router = express.Router();

router.get('/getdatas', getData);

export default router;