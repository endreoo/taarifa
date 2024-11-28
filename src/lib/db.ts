import mysql from 'mysql2/promise';
import { config } from '../config/environment';

const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const db = {
  query: async <T>(sql: string, params?: any[]): Promise<T> => {
    const [rows] = await pool.query(sql, params);
    return rows as T;
  }
}; 