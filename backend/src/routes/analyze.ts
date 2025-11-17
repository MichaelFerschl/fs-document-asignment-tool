import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { PDFService } from '../services/pdfService';
import { ClaudeService } from '../services/claudeService';
import { AnalysisResult, ErrorResponse } from '../types';

const router = Router();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
});

const pdfService = new PDFService();
const claudeService = new ClaudeService(process.env.ANTHROPIC_API_KEY || '');

router.post(
  '/analyze',
  upload.single('pdf'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: 'No file uploaded',
        } as ErrorResponse);
      }

      console.log(`Processing file: ${req.file.originalname}`);

      // Extract text from PDF
      const pdfText = await pdfService.extractText(req.file.path);

      if (!pdfText || pdfText.trim().length === 0) {
        await pdfService.cleanupFile(req.file.path);
        return res.status(400).json({
          error: 'Could not extract text from PDF',
          details: 'The PDF might be empty or contain only images',
        } as ErrorResponse);
      }

      console.log(`Extracted ${pdfText.length} characters from PDF`);

      // Analyze with Claude
      const analysisResult = await claudeService.analyzeDocument(pdfText);

      // Clean up uploaded file
      await pdfService.cleanupFile(req.file.path);

      res.json(analysisResult);
    } catch (error) {
      // Clean up file on error
      if (req.file) {
        await pdfService.cleanupFile(req.file.path);
      }

      console.error('Error analyzing PDF:', error);

      res.status(500).json({
        error: 'Failed to analyze PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      } as ErrorResponse);
    }
  }
);

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'PDF Analyzer API' });
});

export default router;
