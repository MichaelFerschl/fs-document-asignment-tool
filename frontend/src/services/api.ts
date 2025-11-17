import axios from 'axios';
import { AnalysisResult } from '../types';

// In production (Vercel), use relative URL to same domain
// In development, use localhost backend
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD ? '' : 'http://localhost:3001');

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const analyzePDF = async (file: File): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('pdf', file);

  const response = await api.post<AnalysisResult>('/api/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const checkHealth = async (): Promise<{ status: string }> => {
  const response = await api.get('/api/health');
  return response.data;
};
