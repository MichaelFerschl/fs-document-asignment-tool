import React from 'react';
import type { DocumentHeader } from '../types';
import { FileText, Calendar, Building2, User, Euro, Clock } from 'lucide-react';

interface HeaderDataProps {
  data: DocumentHeader;
}

export const HeaderData: React.FC<HeaderDataProps> = ({ data }) => {
  const formatCurrency = (amount?: number, currency?: string) => {
    if (amount === undefined || amount === null) return '-';
    return `${amount.toFixed(2)} ${currency || 'EUR'}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('de-DE');
    } catch {
      return date;
    }
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <FileText className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">Kopfdaten</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auftragsinformationen */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
              <FileText className="w-4 h-4" />
              Auftragsnummer
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {data.auftragsnummer || '-'}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
              <Calendar className="w-4 h-4" />
              Datum
            </label>
            <p className="text-lg text-gray-900">{formatDate(data.datum)}</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
              <Clock className="w-4 h-4" />
              Lieferdatum
            </label>
            <p className="text-lg text-gray-900">{formatDate(data.lieferdatum)}</p>
          </div>
        </div>

        {/* Parteien */}
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
              <Building2 className="w-4 h-4" />
              Lieferant
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {data.lieferant || '-'}
            </p>
            {data.lieferantAdresse && (
              <p className="text-sm text-gray-600 mt-1">{data.lieferantAdresse}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
              <User className="w-4 h-4" />
              Kunde
            </label>
            <p className="text-lg font-semibold text-gray-900">
              {data.kunde || '-'}
            </p>
            {data.kundeAdresse && (
              <p className="text-sm text-gray-600 mt-1">{data.kundeAdresse}</p>
            )}
          </div>
        </div>

        {/* Finanzinformationen */}
        <div className="md:col-span-2 border-t pt-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-1">
                <Euro className="w-4 h-4" />
                Nettobetrag
              </label>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(data.gesamtbetragNetto, data.waehrung)}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                MwSt.
              </label>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(data.mwst, data.waehrung)}
              </p>
            </div>

            <div className="bg-primary-50 rounded-lg p-4">
              <label className="text-sm font-medium text-primary-700 mb-1 block">
                Bruttobetrag
              </label>
              <p className="text-xl font-bold text-primary-900">
                {formatCurrency(data.gesamtbetragBrutto, data.waehrung)}
              </p>
            </div>
          </div>

          {data.zahlungsbedingungen && (
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-600 mb-1 block">
                Zahlungsbedingungen
              </label>
              <p className="text-sm text-gray-700">{data.zahlungsbedingungen}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
