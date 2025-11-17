import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzePDF } from './services/api';
import type { AnalysisResult } from './types';
import { FileText, AlertCircle } from 'lucide-react';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzePDF(file);
      setResult(analysisResult);
    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Ein Fehler ist beim Analysieren des PDFs aufgetreten'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary-600 p-3 rounded-xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                PDF Auftragsdokument Analyzer
              </h1>
              <p className="text-gray-600 mt-1">
                Powered by Anthropic Claude AI
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!result && !error && (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                PDF-Dokument hochladen
              </h2>
              <p className="text-gray-600">
                Laden Sie ein Auftragsdokument hoch, um es automatisch zu analysieren
                und die Daten zu extrahieren
              </p>
            </div>
            <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Was wird analysiert?</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Kopfdaten: Auftragsnummer, Datum, Lieferant, Kunde, etc.</li>
                <li>• Positionen: Artikelnummern, Beschreibungen, Mengen, Preise</li>
                <li>• Finanzinformationen: Netto, MwSt., Brutto</li>
                <li>• Zusatzinformationen: Zahlungsbedingungen, Lieferdatum</li>
              </ul>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-3xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-1">
                    Fehler bei der Analyse
                  </h3>
                  <p className="text-red-700 text-sm mb-4">{error}</p>
                  <button onClick={handleReset} className="btn-primary">
                    Neuer Versuch
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {result && <ResultsDisplay result={result} onReset={handleReset} />}
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>
            Entwickelt mit React, TypeScript, TailwindCSS und Anthropic Claude AI
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
