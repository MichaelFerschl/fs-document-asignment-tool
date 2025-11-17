# Vercel Quickstart (5 Minuten)

## Schritt 1: Deploy auf Vercel

Klicken Sie auf den Button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MichaelFerschl/fs-document-asignment-tool)

## Schritt 2: Repository klonen

1. Vercel fragt nach dem Repository-Namen
2. Klicken Sie auf "Create"
3. Repository wird zu Ihrem GitHub Account geklont

## Schritt 3: Environment Variable setzen

**Wichtig! Ohne diesen Schritt funktioniert die App nicht!**

1. Während des Deployments klicken Sie auf "Add Environment Variable"
2. Name: `ANTHROPIC_API_KEY`
3. Wert: Ihr Claude API Key von [console.anthropic.com](https://console.anthropic.com/)
4. Für alle Environments: Production, Preview, Development

## Schritt 4: Deploy abwarten

- Der Build dauert ca. 2-3 Minuten
- Sie sehen den Fortschritt in Echtzeit

## Schritt 5: Testen

1. Nach erfolgreichem Deploy auf "Visit" klicken
2. PDF hochladen
3. Auf Analyse warten
4. Fertig! 🎉

## Troubleshooting

### "ANTHROPIC_API_KEY not configured"

→ Gehen Sie zu: Vercel Dashboard → Settings → Environment Variables
→ Fügen Sie den API Key hinzu und deployen Sie neu

### Weitere Probleme?

→ Siehe [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) für detaillierte Hilfe

## Kosten

- ✅ **Vercel Free Tier**: Ausreichend für ~100 Analysen/Tag
- ✅ **Anthropic Free Tier**: $5 Startguthaben
- 💡 **Geschätzte Kosten pro Analyse**: ~$0.02-0.05

## Nächste Schritte

- [ ] Custom Domain hinzufügen (optional)
- [ ] Analytics aktivieren
- [ ] Logs überwachen
- [ ] Verschiedene PDFs testen
