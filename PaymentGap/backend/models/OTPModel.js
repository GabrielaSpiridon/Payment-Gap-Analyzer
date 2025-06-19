import pool from '../db/connection.js';

export async function saveOtp(email, code, expires) {
  const conn = await pool.getConnection();
  try {
    await conn.query(
      'INSERT INTO OTP_CODES (email, code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE code=?, expires_at=?',
      [email, code, expires, code, expires]
    );
  } finally {
    conn.release();
  }
}

export async function getOtp(email) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      'SELECT code, expires_at FROM OTP_CODES WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

export async function deleteOtp(email) {
  const conn = await pool.getConnection();
  try {
    await conn.query('DELETE FROM OTP_CODES WHERE email = ?', [email]);
  } finally {
    conn.release();
  }
}
