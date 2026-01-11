import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';
import { MOCK_NEWS } from '../../../../constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Try to query the database
    const [rows] = await pool.query('SELECT * FROM articles WHERE active = 1 ORDER BY created_at DESC');
    
    // Transform DB rows to match API expectations if necessary
    // Currently, DB columns match: id, title, summary, content, category, related_tickers, author, image_url, created_at
    const articles = rows.map(article => ({
      ...article,
      related_tickers: article.related_tickers // Keep as string or split if needed by frontend, but we decided string for now
    }));

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Database connection failed, falling back to mock data:', error);
    
    // Fallback to mock data
    return NextResponse.json(MOCK_NEWS);
  }
}
