// pages/api/sheets/transactions.js
import { withAuth } from '../../../lib/session';

async function handler(req, res, session) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Credenciais do Google Sheets armazenadas de forma segura no servidor
    const GOOGLE_SHEETS_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID;
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    // Buscar dados da aba "Transações"
    const transUrl = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEETS_ID}/values/Transações?key=${GOOGLE_API_KEY}`;
    const transResponse = await fetch(transUrl);
    const transData = await transResponse.json();

    if (!transData.values) {
      throw new Error('Não consegui ler a aba "Transações". Verifica se existe e está compartilhada.');
    }

    // Converter para objetos
    const headers = transData.values[0];
    const rows = transData.values.slice(1);
    const transactions = rows.map(row => {
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header.trim()] = row[idx] || '';
      });
      return obj;
    }).filter(t => t.Data); // Filtrar linhas vazias

    return res.status(200).json({ transactions });
  } catch (error) {
    console.error('Erro ao buscar dados do Google Sheets:', error);
    return res.status(500).json({
      error: 'Erro ao carregar dados',
      message: error.message
    });
  }
}

export default withAuth(handler);
