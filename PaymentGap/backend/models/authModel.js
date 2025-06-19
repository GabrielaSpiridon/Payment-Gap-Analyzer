import pool from '../db/connection.js';

export async function getUserByUsernameAndPassword(username, password) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        "SELECT id_user, username, role FROM USERS WHERE username = ? AND password = ? LIMIT 1",
        [username, password]
      );
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getUserByUsernameAndPassword:", err);
    throw err;
  }
}

export async function createUser(username, password, role) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        "INSERT INTO USERS(username, password, role) VALUES(?,?,?)",
        [username, password, role]
      );
      return result.insertId || null;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.error("Duplicate username:", err);
        return null;
      } else {
        console.error("Error in createUser:", err);
        throw err;
      }
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Database connection error:", err);
    throw err;
  }
}

export async function deleteUserById(id_user) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        "DELETE FROM USERS WHERE id_user = ?",
        [id_user]
      );
      return result.affectedRows > 0; 
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteUserById:", err);
    throw err;
  }
}

export async function updateUserPassword(username, newPassword) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        "UPDATE USERS SET password = ? WHERE username = ?",
        [newPassword, username]
      );
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in updateUserPassword:", err);
    throw err;
  }
}
