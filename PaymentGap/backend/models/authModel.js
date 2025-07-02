import pool from '../db/connection.js';
import bcrypt from 'bcrypt';

export async function getUserByUsernameAndPassword(username, password) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query(
        "SELECT id_user, username, password, role FROM USERS WHERE username = ? LIMIT 1",
        [username]
      );

      if (rows.length > 0) {
        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          // Password matches, return user details without password
          return { id_user: user.id_user, username: user.username, role: user.role };
        }
      }
      return null;
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
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await conn.query(
        "INSERT INTO USERS(username, password, role) VALUES(?,?,?)",
        [username, hashedPassword, role]
      );
      return result.insertId || null;
    } catch (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        console.error("Duplicate email:", err);
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
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const result = await conn.query(
        "UPDATE USERS SET password = ? WHERE username = ?",
        [hashedPassword, username]
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
