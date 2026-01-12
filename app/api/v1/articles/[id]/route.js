import { NextResponse } from 'next/server';
import pool from '../../../../../lib/db';
import { MOCK_NEWS } from '../../../../../constants';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { id } = await params;
  
  try {
    const [rows] = await pool.query('SELECT * FROM articles WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      // Fallback to check if it's a mock ID (since we mix them in fallback scenarios)
      const mockArticle = MOCK_NEWS.find(n => n.id.toString() === id);
      if (mockArticle) {
        return NextResponse.json(mockArticle);
      }
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const article = rows[0];
    return NextResponse.json({
      ...article,
      related_tickers: article.related_tickers
    });
  } catch (error) {
    console.error('Database error:', error);
    // Fallback for mock data if DB fails
    const mockArticle = MOCK_NEWS.find(n => n.id.toString() === id);
    if (mockArticle) {
      return NextResponse.json(mockArticle);
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
