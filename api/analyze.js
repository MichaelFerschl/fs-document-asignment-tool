const Anthropic = require('@anthropic-ai/sdk');
const pdfParse = require('pdf-parse');
const formidable = require('formidable');
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
    model: 'claude-3-5-sonnet-20241022',
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
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Method not allowed',
    });
  }

  try {
    // Check API key
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY not configured');
    }

    // Parse form data
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
    });

    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const pdfFile = files.pdf?.[0] || files.pdf;

    if (!pdfFile) {
      return res.status(400).json({
        error: 'No file uploaded',
      });
    }

    // Check if file is PDF
    if (pdfFile.mimetype !== 'application/pdf') {
      return res.status(400).json({
        error: 'Only PDF files are allowed',
      });
    }

    console.log(`Processing file: ${pdfFile.originalFilename || pdfFile.newFilename}`);

    // Extract text from PDF
    const pdfText = await extractText(pdfFile.filepath);

    if (!pdfText || pdfText.trim().length === 0) {
      // Cleanup
      try {
        await fs.unlink(pdfFile.filepath);
      } catch (e) {
        console.error('Cleanup error:', e);
      }

      return res.status(400).json({
        error: 'Could not extract text from PDF',
        details: 'The PDF might be empty or contain only images',
      });
    }

    console.log(`Extracted ${pdfText.length} characters from PDF`);

    // Analyze with Claude
    const analysisResult = await analyzeDocument(pdfText, apiKey);

    // Cleanup file
    try {
      await fs.unlink(pdfFile.filepath);
    } catch (e) {
      console.error('Cleanup error:', e);
    }

    return res.status(200).json(analysisResult);
  } catch (error) {
    console.error('Error analyzing PDF:', error);

    return res.status(500).json({
      error: 'Failed to analyze PDF',
      details: error.message,
    });
  }
};
