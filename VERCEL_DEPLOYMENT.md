# Vercel Deployment Anleitung

Diese Anleitung zeigt Ihnen, wie Sie die PDF Auftragsdokument Analyzer App auf Vercel deployen.

## Voraussetzungen

1. **GitHub Account** - Ihr Code sollte in einem GitHub Repository liegen
2. **Vercel Account** - Erstellen Sie einen kostenlosen Account auf [vercel.com](https://vercel.com)
3. **Anthropic API Key** - Von [console.anthropic.com](https://console.anthropic.com/)

## Deployment-Schritte

### Schritt 1: Repository zu Vercel importieren

1. Gehen Sie zu [vercel.com](https://vercel.com) und melden Sie sich an
2. Klicken Sie auf "Add New Project"
3. Importieren Sie Ihr GitHub Repository
4. Vercel erkennt automatisch das Framework (Vite)

### Schritt 2: Build-Einstellungen konfigurieren

Vercel sollte automatisch die richtigen Einstellungen erkennen. Falls nicht, verwenden Sie:

```
Framework Preset: Vite
Root Directory: ./
Build Command: cd frontend && npm install && npm run build
Output Directory: frontend/dist
Install Command: npm install --prefix frontend && npm install --prefix api
```

### Schritt 3: Environment Variables einrichten

Im Vercel Dashboard, unter "Settings" → "Environment Variables", fügen Sie hinzu:

| Variable | Wert | Environment |
|----------|------|-------------|
| `ANTHROPIC_API_KEY` | Ihr Claude API Key | Production, Preview, Development |

**Wichtig:** Der API Key wird für die Serverless Functions benötigt.

### Schritt 4: Deploy

1. Klicken Sie auf "Deploy"
2. Warten Sie, bis der Build abgeschlossen ist (ca. 2-3 Minuten)
3. Nach erfolgreichem Deploy erhalten Sie eine URL (z.B. `your-app.vercel.app`)

### Schritt 5: Testen

1. Öffnen Sie die Vercel URL in Ihrem Browser
2. Laden Sie eine Test-PDF hoch
3. Überprüfen Sie, ob die Analyse funktioniert

## Architektur auf Vercel

### Frontend
- Wird als statische Site gehostet
- Vite Build-Output aus `frontend/dist`
- Automatisches Caching und CDN-Distribution

### Backend (Serverless Functions)
- **API Routes** in `/api` Ordner:
  - `/api/analyze.js` - PDF-Analyse Endpoint
  - `/api/health.js` - Health-Check Endpoint
- Jede Anfrage startet eine neue Serverless Function
- Automatisches Scaling
- Max. Execution Time: 60 Sekunden (konfigurierbar)
- Max. Memory: 1024 MB

### Routing
Die `vercel.json` konfiguriert:
- API-Requests zu `/api/*` werden an Serverless Functions geleitet
- Alle anderen Requests werden an das Frontend (SPA) geleitet

## Vercel CLI (Optional)

### Installation

```bash
npm install -g vercel
```

### Lokales Testing

```bash
# Im Projekt-Root
vercel dev
```

Dies startet:
- Frontend auf Port 3000
- API Routes als Serverless Functions

### Manuelles Deployment

```bash
# Production Deployment
vercel --prod

# Preview Deployment
vercel
```

## Environment Variables Lokal Testen

Erstellen Sie `.env` im Root-Verzeichnis für lokales Vercel Dev:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

**Wichtig:** Diese Datei ist in `.gitignore` und wird nicht committed!

## Troubleshooting

### Problem: "ANTHROPIC_API_KEY not configured"

**Lösung:**
1. Überprüfen Sie, ob die Environment Variable in Vercel gesetzt ist
2. Gehen Sie zu Vercel Dashboard → Settings → Environment Variables
3. Fügen Sie `ANTHROPIC_API_KEY` hinzu
4. Redeploy auslösen (Settings → Deployments → Redeploy)

### Problem: "Function execution timed out"

**Lösung:**
- Claude API-Anfragen können bei großen PDFs länger dauern
- Erhöhen Sie `maxDuration` in `vercel.json`:
  ```json
  "functions": {
    "api/**/*.js": {
      "maxDuration": 300  // 5 Minuten (nur mit Pro Plan)
    }
  }
  ```
- Hinweis: Free Plan hat 10s Limit, Pro Plan bis 300s

### Problem: "File too large"

**Lösung:**
- Vercel hat ein Limit von 4.5 MB für Serverless Function Body
- Für größere PDFs verwenden Sie einen dedizierten Backend-Service
- Alternative: Komprimieren Sie PDFs vor dem Upload

### Problem: API Routes funktionieren nicht

**Lösung:**
1. Überprüfen Sie `vercel.json` Konfiguration
2. Stellen Sie sicher, dass `/api` Ordner im Root liegt
3. Checken Sie Vercel Function Logs:
   - Vercel Dashboard → Deployments → [Your Deployment] → Functions

### Problem: CORS Errors

**Lösung:**
- Die API Routes setzen bereits CORS Headers
- Bei Problemen checken Sie `api/analyze.js` und `api/health.js`
- Vergewissern Sie sich, dass `Access-Control-Allow-Origin` gesetzt ist

## Performance-Optimierung

### 1. Caching

Vercel cached automatisch statische Assets. Für API-Responses:

```javascript
res.setHeader('Cache-Control', 's-maxage=1, stale-while-revalidate');
```

### 2. Edge Functions (Optional)

Für schnellere Response-Zeiten in Europa/Asien, konvertieren Sie zu Edge Functions:

```javascript
// api/health.js
export const config = {
  runtime: 'edge',
};
```

### 3. Build-Optimierung

```bash
# Frontend optimieren
cd frontend
npm run build -- --minify

# Analyze Bundle Size
npm install -D rollup-plugin-visualizer
```

## Monitoring

### Vercel Analytics

1. Aktivieren Sie Analytics im Vercel Dashboard
2. Sehen Sie Real-time Performance Metrics
3. Tracken Sie Serverless Function Invocations

### Logs ansehen

```bash
# Mit Vercel CLI
vercel logs [deployment-url]

# Oder im Dashboard
Deployments → [Your Deployment] → View Function Logs
```

## Kosten

### Vercel Free Tier
- ✅ Unbegrenzte Deployments
- ✅ 100 GB Bandwidth/Monat
- ✅ 100 GB-Hours Serverless Functions
- ⚠️ 10s Function Execution Limit
- ✅ Ausreichend für kleine bis mittlere Nutzung

### Vercel Pro ($20/Monat)
- ✅ 1 TB Bandwidth
- ✅ 1000 GB-Hours Serverless Functions
- ✅ 300s Function Execution Limit (5 Minuten)
- ✅ Team Collaboration

**Geschätzte Kosten:**
- ~100 PDF-Analysen/Tag: **Free Tier ausreichend**
- ~1000 PDF-Analysen/Tag: **Pro Plan empfohlen**

## Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Fügen Sie Ihre Domain hinzu (z.B. `pdf-analyzer.example.com`)
3. Folgen Sie den DNS-Konfigurationsanweisungen
4. Automatisches SSL-Zertifikat

## Continuous Deployment

Vercel deployed automatisch bei jedem Git Push:

- **Main Branch** → Production Deployment
- **Other Branches** → Preview Deployments
- **Pull Requests** → Automatische Preview URLs

## Sicherheit

### Environment Variables
- Nie im Code hardcoden
- Nur über Vercel Dashboard setzen
- Separate Werte für Production/Preview/Development

### API Rate Limiting

Fügen Sie Rate Limiting hinzu (z.B. mit Upstash):

```bash
npm install @upstash/ratelimit
```

```javascript
// api/analyze.js
const { Ratelimit } = require('@upstash/ratelimit');

const ratelimit = new Ratelimit({
  redis: ...,
  limiter: Ratelimit.slidingWindow(10, '1 h'),
});
```

## Alternativen zu Vercel

Falls Vercel nicht passt:

1. **Netlify** - Ähnlich wie Vercel, mit Functions
2. **Railway** - Einfacher für Backend-Services
3. **Render** - Full-stack deployment
4. **Fly.io** - Globale Edge-Deployment

## Support

- [Vercel Dokumentation](https://vercel.com/docs)
- [Vercel Discord](https://vercel.com/discord)
- [Vercel Support](https://vercel.com/support)

## Nächste Schritte

Nach erfolgreichem Deployment:

1. ✅ Testen Sie mit verschiedenen PDF-Formaten
2. ✅ Überwachen Sie die Logs
3. ✅ Aktivieren Sie Analytics
4. ✅ Richten Sie Custom Domain ein (optional)
5. ✅ Implementieren Sie Rate Limiting (empfohlen für Production)
6. ✅ Fügen Sie Error Tracking hinzu (z.B. Sentry)
