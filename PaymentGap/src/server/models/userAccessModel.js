import pool from '../db/connection.js';

export async function getAllUsers() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM USERS");
    return rows;
  } finally {
    conn.release();
  }
}

export async function getUserById(id_user) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM USERS WHERE id_user = ?", [id_user]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

export async function createUser(username, password, role) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO USERS (username, password, role) VALUES (?, ?, ?)",
      [username, password, role]
    );
    return Number(result.insertId);
  } finally {
    conn.release();
  }
}

export async function updateUser(id_user, username, password, role) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "UPDATE USERS SET username = ?, password = ?, role = ? WHERE id_user = ?",
      [username, password, role, id_user]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function deleteUser(id_user) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query("DELETE FROM USERS WHERE id_user = ?", [id_user]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}
