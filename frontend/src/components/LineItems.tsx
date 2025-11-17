import React from 'react';
import type { DocumentLine } from '../types';
import { ShoppingCart } from 'lucide-react';

interface LineItemsProps {
  items: DocumentLine[];
}

export const LineItems: React.FC<LineItemsProps> = ({ items }) => {
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <ShoppingCart className="w-6 h-6 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-800">Positionen</h2>
        <span className="ml-auto bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
          {items.length} {items.length === 1 ? 'Position' : 'Positionen'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Pos.
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Artikelnummer
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Beschreibung
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Menge
              </th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                Einheit
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Einzelpreis
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                Rabatt
              </th>
              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 bg-primary-50">
                Gesamtpreis
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-gray-900">
                  {item.position}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {item.artikelnummer || '-'}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {item.beschreibung}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {item.menge}
                </td>
                <td className="py-3 px-4 text-sm text-gray-700">
                  {item.einheit || '-'}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-900">
                  {formatCurrency(item.einzelpreis)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">
                  {item.rabatt ? `${item.rabatt}%` : '-'}
                </td>
                <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900 bg-primary-50">
                  {formatCurrency(item.gesamtpreis)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300">
              <td colSpan={7} className="py-4 px-4 text-right font-semibold text-gray-700">
                Gesamtsumme
              </td>
              <td className="py-4 px-4 text-right font-bold text-lg text-primary-900 bg-primary-100">
                {formatCurrency(
                  items.reduce((sum, item) => sum + item.gesamtpreis, 0)
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
