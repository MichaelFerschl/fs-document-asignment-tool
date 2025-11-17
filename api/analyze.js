const Anthropic = require('@anthropic-ai/sdk');
const pdfParse = require('pdf-parse');
const { formidable } = require('formidable');
const fs = require('fs').promises;

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Claude Service
async function analyzeDocument(pdfText, apiKey) {
  const client = new Anthropic({ apiKey });

  const prompt = `Du bist ein Experte für die Analyse von Auftragsdokumenten und Rechnungen.

Analysiere den folgenden Text aus einem PDF-Dokument und extrahiere die Informationen in einem strukturierten JSON-Format.

WICHTIG: Antworte NUR mit einem validen JSON-Objekt, ohne zusätzlichen Text oder Markdown.

Das JSON-Objekt muss folgende Struktur haben:

{
  "kopfdaten": {
    "auftragsnummer": "string oder null",
    "datum": "string (Format: YYYY-MM-DD) oder null",
    "lieferant": "string oder null",
    "lieferantAdresse": "string oder null",
    "kunde": "string oder null",
    "kundeAdresse": "string oder null",
    "gesamtbetragNetto": number oder null,
    "mwst": number oder null,
    "gesamtbetragBrutto": number oder null,
    "waehrung": "string (z.B. EUR, USD) oder null",
    "zahlungsbedingungen": "string oder null",
    "lieferdatum": "string (Format: YYYY-MM-DD) oder null"
  },
  "positionen": [
    {
      "position": number,
      "artikelnummer": "string oder null",
      "beschreibung": "string",
      "menge": number,
      "einheit": "string (z.B. Stück, kg) oder null",
      "einzelpreis": number,
      "rabatt": number oder null,
      "gesamtpreis": number
    }
  ],
  "confidence": "high | medium | low"
}

PDF-Text:
${pdfText}`;

  const message = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 4096,
    messages: [{ role: 'user', content: prompt }],
  });

  const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

  // Parse JSON response
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  const jsonResult = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(responseText);

  return {
    ...jsonResult,
    rawText: pdfText.substring(0, 500),
  };
}

// PDF Service
async function extractText(filePath) {
  const dataBuffer = await fs.readFile(filePath);
  const data = await pdfParse(dataBuffer);
  return data.text;
}

// Main handler
module.exports = async (req, res) => {
  console.log('[ANALYZE] Request received:', {
    method: req.method,
    headers: req.headers,
    url: req.url
  });

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    console.log('[ANALYZE] Handling OPTIONS request');
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    console.log('[ANALYZE] Method not allowed:', req.method);
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    // Check API key
    console.log('[ANALYZE] Checking API key...');
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('[ANALYZE] ANTHROPIC_API_KEY not configured');
      throw new Error('ANTHROPIC_API_KEY not configured');
    }
    console.log('[ANALYZE] API key found');

    // Parse form data
    console.log('[ANALYZE] Parsing form data...');
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    let fields, files;
    try {
      [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) {
            console.error('[ANALYZE] Formidable parse error:', err);
            reject(err);
          } else {
            console.log('[ANALYZE] Form parsed successfully:', {
              fieldCount: Object.keys(fields).length,
              fileCount: Object.keys(files).length,
              files: Object.keys(files)
            });
            resolve([fields, files]);
          }
        });
      });
    } catch (parseError) {
      console.error('[ANALYZE] Failed to parse form:', parseError);
      throw parseError;
    }

    const pdfFile = files.pdf?.[0] || files.pdf;
    console.log('[ANALYZE] PDF file info:', {
      exists: !!pdfFile,
      mimetype: pdfFile?.mimetype,
      size: pdfFile?.size,
      filepath: pdfFile?.filepath,
      originalFilename: pdfFile?.originalFilename
    });

    if (!pdfFile) {
      console.error('[ANALYZE] No file uploaded');
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }

    // Check if file is PDF
    if (pdfFile.mimetype !== 'application/pdf') {
      console.error('[ANALYZE] Invalid file type:', pdfFile.mimetype);
      return res.status(400).json({
        error: 'Only PDF files are allowed',
      });
    }

    console.log(`[ANALYZE] Processing file: ${pdfFile.originalFilename || pdfFile.newFilename}`);

    // Extract text from PDF
    console.log('[ANALYZE] Extracting text from PDF...');
    let pdfText;
    try {
      pdfText = await extractText(pdfFile.filepath);
      console.log(`[ANALYZE] Extracted ${pdfText?.length || 0} characters from PDF`);
    } catch (extractError) {
      console.error('[ANALYZE] PDF extraction error:', extractError);
      throw new Error(`PDF extraction failed: ${extractError.message}`);
    }

    if (!pdfText || pdfText.trim().length === 0) {
      console.error('[ANALYZE] PDF is empty');
      // Cleanup
      try {
        await fs.unlink(pdfFile.filepath);
      } catch (e) {
        console.error('[ANALYZE] Cleanup error:', e);
      }

      return res.status(400).json({
        error: 'Could not extract text from PDF',
        details: 'The PDF might be empty or contain only images',
      });
    }

    // Analyze with Claude
    console.log('[ANALYZE] Sending to Claude API...');
    let analysisResult;
    try {
      analysisResult = await analyzeDocument(pdfText, apiKey);
      console.log('[ANALYZE] Claude analysis completed successfully');
    } catch (claudeError) {
      console.error('[ANALYZE] Claude API error:', claudeError);
      throw new Error(`Claude API failed: ${claudeError.message}`);
    }

    // Cleanup file
    console.log('[ANALYZE] Cleaning up file...');
    try {
      await fs.unlink(pdfFile.filepath);
    } catch (e) {
      console.error('[ANALYZE] Cleanup error:', e);
    }

    console.log('[ANALYZE] Sending successful response');
    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('[ANALYZE] Error analyzing PDF:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });

    return res.status(500).json({
      error: 'Failed to analyze PDF',
      details: error.message,
      errorName: error.name,
      errorStack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Vercel configuration
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
