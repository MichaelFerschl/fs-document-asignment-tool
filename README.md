# PDF Auftragsdokument Analyzer

Eine moderne Webanwendung zur automatischen Analyse von PDF-Auftragsdokumenten und Rechnungen mit KI-Unterstützung durch Anthropic Claude.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MichaelFerschl/fs-document-asignment-tool)

> **🚀 Vercel Deployment verfügbar!** Siehe [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) für Details.

## Features

- **PDF-Upload mit Drag & Drop**: Einfaches Hochladen von PDF-Dokumenten
- **KI-gestützte Analyse**: Automatische Extraktion von Kopf- und Zeilendaten durch Anthropic Claude
- **Strukturierte Datenausgabe**: Übersichtliche Darstellung aller extrahierten Informationen
- **JSON-Export**: Exportieren der analysierten Daten im JSON-Format
- **Moderne UI**: Responsive Design mit TailwindCSS

### Extrahierte Daten

**Kopfdaten:**
- Auftragsnummer
- Datum und Lieferdatum
- Lieferant und Lieferantenadresse
- Kunde und Kundenadresse
- Finanzinformationen (Netto, MwSt., Brutto)
- Währung
- Zahlungsbedingungen

**Positionsdaten:**
- Positionsnummer
- Artikelnummer
- Beschreibung
- Menge und Einheit
- Einzelpreis
- Rabatt
- Gesamtpreis

## Tech Stack

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Axios
- Lucide React (Icons)

### Backend
- Node.js
- Express
- TypeScript
- Anthropic Claude SDK
- pdf-parse
- Multer (File Upload)

## Installation

### Voraussetzungen

- Node.js 18+ und npm
- Anthropic API Key ([hier erhalten](https://console.anthropic.com/))

### Backend Setup

```bash
cd backend
npm install

# Erstelle .env Datei
cp .env.example .env

# Füge deinen Anthropic API Key hinzu
# ANTHROPIC_API_KEY=your_api_key_here
```

### Frontend Setup

```bash
cd frontend
npm install

# Optional: .env für API-URL erstellen
cp .env.example .env
```

## Konfiguration

### Backend (.env)

```env
ANTHROPIC_API_KEY=your_api_key_here
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001
```

## Starten der Anwendung

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Die Anwendung ist nun verfügbar unter:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

### Production Build (Lokal)

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

### Cloud Deployment

#### Vercel (Empfohlen)

Die einfachste Methode für Deployment:

1. [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MichaelFerschl/fs-document-asignment-tool)
2. Setzen Sie `ANTHROPIC_API_KEY` als Environment Variable
3. Fertig!

Detaillierte Anleitung: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

#### Andere Plattformen

- **Netlify**: Ähnlich wie Vercel mit Functions
- **Railway**: Gut für Backend-Services
- **Render**: Full-stack Hosting

## Verwendung

1. Öffnen Sie die Webanwendung im Browser
2. Laden Sie eine PDF-Datei hoch (Drag & Drop oder Klick)
3. Warten Sie auf die Analyse durch Claude AI
4. Betrachten Sie die extrahierten Daten:
   - Kopfdaten in strukturierter Form
   - Positionen als Tabelle
5. Optional: Exportieren Sie die Daten als JSON

## API Endpoints

### `POST /api/analyze`

Analysiert eine hochgeladene PDF-Datei.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` (File)

**Response:**
```json
{
  "kopfdaten": {
    "auftragsnummer": "123456",
    "datum": "2024-01-15",
    "lieferant": "Beispiel GmbH",
    ...
  },
  "positionen": [
    {
      "position": 1,
      "beschreibung": "Produkt A",
      "menge": 10,
      "einzelpreis": 99.99,
      "gesamtpreis": 999.90
    }
  ],
  "confidence": "high"
}
```

### `GET /api/health`

Überprüft den Status der API.

**Response:**
```json
{
  "status": "ok",
  "service": "PDF Analyzer API"
}
```

## Projekt-Struktur

```
fs-document-asignment-tool/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── analyze.ts
│   │   ├── services/
│   │   │   ├── claudeService.ts
│   │   │   └── pdfService.ts
│   │   ├── types.ts
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FileUpload.tsx
│   │   │   ├── HeaderData.tsx
│   │   │   ├── LineItems.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── README.md
```

## Entwicklung

### Backend-Entwicklung

```bash
# Development mit Auto-Reload
npm run dev

# Type-Checking
npm run type-check

# Build
npm run build
```

### Frontend-Entwicklung

```bash
# Development Server
npm run dev

# Linting
npm run lint

# Build
npm run build
```

## Fehlerbehandlung

Die Anwendung behandelt folgende Fehler:

- **Ungültige Dateiformate**: Nur PDF-Dateien werden akzeptiert
- **Dateigrößen-Limit**: Maximum 10 MB
- **Leere PDFs**: Warnung wenn kein Text extrahiert werden kann
- **API-Fehler**: Benutzerfreundliche Fehlermeldungen
- **Netzwerkfehler**: Timeout-Handling und Retry-Logik

## Sicherheit

- CORS-Schutz konfiguriert
- Dateigrößen-Limits
- Validierung der Dateitypen
- Automatisches Cleanup hochgeladener Dateien
- Environment Variables für sensible Daten

## Performance

- Effizientes PDF-Parsing
- Optimierte Claude API-Anfragen
- React-Komponenten mit useMemo/useCallback
- Lazy Loading für große Datensätze

## Lizenz

MIT

## Support

Bei Fragen oder Problemen öffnen Sie bitte ein Issue im GitHub-Repository.

## Credits

Entwickelt mit:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Anthropic Claude](https://www.anthropic.com/)
- [Express](https://expressjs.com/)
