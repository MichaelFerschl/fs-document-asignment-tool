import React from 'react';
import { AnalysisResult } from '../types';
import { HeaderData } from './HeaderData';
import { LineItems } from './LineItems';
import { CheckCircle, AlertCircle, Download } from 'lucide-react';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, onReset }) => {
  const getConfidenceColor = (confidence?: string) => {
    switch (confidence) {
      case 'high':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getConfidenceText = (confidence?: string) => {
    switch (confidence) {
      case 'high':
        return 'Hohe Konfidenz';
      case 'medium':
        return 'Mittlere Konfidenz';
      case 'low':
        return 'Niedrige Konfidenz';
      default:
        return 'Unbekannt';
    }
  };

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(result, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analyse-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header mit Aktionen */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Analyse abgeschlossen</h2>
              <p className="text-sm text-gray-600 mt-1">
                Das Dokument wurde erfolgreich analysiert
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {result.confidence && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getConfidenceColor(result.confidence)}`}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {getConfidenceText(result.confidence)}
                </span>
              </div>
            )}

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              JSON Export
            </button>

            <button
              onClick={onReset}
              className="btn-primary"
            >
              Neues Dokument
            </button>
          </div>
        </div>
      </div>

      {/* Kopfdaten */}
      <HeaderData data={result.kopfdaten} />

      {/* Positionen */}
      {result.positionen && result.positionen.length > 0 && (
        <LineItems items={result.positionen} />
      )}

      {/* Raw Text (optional, für Debugging) */}
      {result.rawText && (
        <details className="card">
          <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900">
            Extrahierter Text (Vorschau)
          </summary>
          <pre className="mt-4 p-4 bg-gray-50 rounded-lg text-xs text-gray-600 overflow-x-auto">
            {result.rawText}
          </pre>
        </details>
      )}
    </div>
  );
};
