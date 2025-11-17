export interface DocumentHeader {
  auftragsnummer?: string;
  datum?: string;
  lieferant?: string;
  lieferantAdresse?: string;
  kunde?: string;
  kundeAdresse?: string;
  gesamtbetragNetto?: number;
  mwst?: number;
  gesamtbetragBrutto?: number;
  waehrung?: string;
  zahlungsbedingungen?: string;
  lieferdatum?: string;
}

export interface DocumentLine {
  position: number;
  artikelnummer?: string;
  beschreibung: string;
  menge: number;
  einheit?: string;
  einzelpreis: number;
  rabatt?: number;
  gesamtpreis: number;
}

export interface AnalysisResult {
  kopfdaten: DocumentHeader;
  positionen: DocumentLine[];
  rawText?: string;
  confidence?: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}
