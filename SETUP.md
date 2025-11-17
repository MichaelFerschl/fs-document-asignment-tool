# Setup-Anleitung

Diese Anleitung führt Sie durch die Einrichtung der PDF Auftragsdokument Analyzer Anwendung.

## Schritt 1: Anthropic API Key erhalten

1. Gehen Sie zu [Anthropic Console](https://console.anthropic.com/)
2. Erstellen Sie einen Account oder melden Sie sich an
3. Navigieren Sie zu "API Keys"
4. Erstellen Sie einen neuen API Key
5. Kopieren Sie den API Key (Sie werden ihn im nächsten Schritt benötigen)

## Schritt 2: Dependencies installieren

### Option A: Alle auf einmal installieren (empfohlen)

```bash
# Im Root-Verzeichnis
npm install
npm run install:all
```

### Option B: Manuell installieren

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

## Schritt 3: Backend konfigurieren

```bash
cd backend

# .env Datei erstellen
cp .env.example .env

# Öffnen Sie die .env Datei und fügen Sie Ihren API Key hinzu
# nano .env
# oder
# code .env
```

In der `.env` Datei:
```env
ANTHROPIC_API_KEY=sk-ant-...  # Ihr API Key hier
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## Schritt 4: Frontend konfigurieren (optional)

```bash
cd frontend

# .env Datei erstellen (optional, Standardwerte funktionieren)
cp .env.example .env
```

## Schritt 5: Anwendung starten

### Option A: Beide Server gleichzeitig (empfohlen)

```bash
# Im Root-Verzeichnis
npm run dev
```

### Option B: Server einzeln starten

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

## Schritt 6: Anwendung testen

1. Öffnen Sie Ihren Browser und navigieren Sie zu: http://localhost:5173
2. Sie sollten die PDF Analyzer Oberfläche sehen
3. Laden Sie eine Test-PDF hoch
4. Warten Sie auf die Analyse
5. Überprüfen Sie die extrahierten Daten

## Troubleshooting

### Backend startet nicht

**Problem:** `Error: ANTHROPIC_API_KEY not set`
**Lösung:** Überprüfen Sie, ob die `.env` Datei im `backend/` Ordner existiert und den API Key enthält

**Problem:** `Port 3001 already in use`
**Lösung:** Ändern Sie den PORT in der `.env` Datei auf einen anderen Wert (z.B. 3002)

### Frontend kann Backend nicht erreichen

**Problem:** `Network Error` oder `Failed to fetch`
**Lösung:**
1. Überprüfen Sie, ob das Backend läuft (http://localhost:3001/api/health sollte funktionieren)
2. Überprüfen Sie die CORS-Einstellungen in `backend/.env`
3. Überprüfen Sie die API_URL in `frontend/.env`

### PDF wird nicht analysiert

**Problem:** `Could not extract text from PDF`
**Lösung:** Die PDF könnte nur gescannte Bilder enthalten. Versuchen Sie eine PDF mit Text-Content.

**Problem:** `Failed to analyze document with Claude`
**Lösung:**
1. Überprüfen Sie Ihren API Key
2. Überprüfen Sie Ihr Anthropic API-Guthaben
3. Überprüfen Sie die Netzwerkverbindung

### TypeScript-Fehler

**Problem:** Type errors in IDE
**Lösung:**
```bash
# Backend
cd backend
npm run type-check

# Frontend
cd frontend
npm run build -- --mode development
```

## Production Deployment

### Build erstellen

```bash
# Im Root-Verzeichnis
npm run build
```

### Server starten

```bash
# Backend
cd backend
npm start

# Frontend (in einem anderen Terminal)
cd frontend
npm run preview
```

Für echtes Production-Deployment empfehlen wir:
- Backend: PM2, Docker, oder Cloud-Plattform (Heroku, Railway, etc.)
- Frontend: Vercel, Netlify, oder statisches Hosting

## Nächste Schritte

- Lesen Sie die [API-Dokumentation](README.md#api-endpoints)
- Passen Sie die UI nach Ihren Bedürfnissen an
- Erweitern Sie die Datenextraktion für Ihre spezifischen Dokumenttypen
- Fügen Sie zusätzliche Features hinzu (Datenbank-Speicherung, Benutzer-Authentifizierung, etc.)

## Support

Bei Fragen öffnen Sie bitte ein Issue im Repository.
