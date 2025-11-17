import Anthropic from '@anthropic-ai/sdk';
import { AnalysisResult } from '../types';

export class ClaudeService {
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({
      apiKey: apiKey,
    });
  }

  async analyzeDocument(pdfText: string): Promise<AnalysisResult> {
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

Beachte:
- Extrahiere alle verfügbaren Informationen aus dem Dokument
- Verwende null für nicht gefundene Felder
- Beträge sollten als Zahlen (ohne Währungssymbol) angegeben werden
- Datumsangaben im Format YYYY-MM-DD
- Die "confidence" gibt an, wie sicher du dir bei der Extraktion bist

PDF-Text:
${pdfText}`;

    try {
      const message = await this.client.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const responseText = message.content[0].type === 'text'
        ? message.content[0].text
        : '';

      // Parse JSON response
      let jsonResult;
      try {
        // Try to extract JSON from the response (in case Claude added markdown)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          jsonResult = JSON.parse(jsonMatch[0]);
        } else {
          jsonResult = JSON.parse(responseText);
        }
      } catch (parseError) {
        console.error('Failed to parse Claude response:', responseText);
        throw new Error('Invalid JSON response from Claude');
      }

      return {
        ...jsonResult,
        rawText: pdfText.substring(0, 500), // First 500 chars for reference
      };
    } catch (error) {
      console.error('Error calling Claude API:', error);
      throw new Error('Failed to analyze document with Claude');
    }
  }
}
