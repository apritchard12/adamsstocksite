import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

try {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stock_news',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  console.log('MySQL Pool created');
} catch (error) {
  console.error('Failed to create MySQL pool', error);
}

export default pool;
