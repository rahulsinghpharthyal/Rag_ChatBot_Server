import express from 'express';
import { chatWithAI } from '../controllers/chatWithAI.controller.js';
import { chatWithRag } from '../controllers/chatWithRag.controller.js';
import { uploadPDF } from '../config/multer.config.js';
import { uploadAndIndexPDF } from '../controllers/pdfUpload.controller.js';

const router = express.Router();


// ---------------- PUBLIC ROUTES----------------
router.post('/chat/general', chatWithAI);
router.post('/chat/rag', chatWithRag);
router.post("/rag/upload", uploadPDF.single("pdf"), uploadAndIndexPDF);


// ---------------- PRIVATE ROUTES----------------


export default router;
