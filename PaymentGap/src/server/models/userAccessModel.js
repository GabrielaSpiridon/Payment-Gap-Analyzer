import pool from '../db/connection.js';

export async function getAllUsers() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM USER_ACCESS");
    return rows;
  } finally {
    conn.release();
  }
}

export async function getUserById(id_user_access) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM USER_ACCESS WHERE id_user_access = ?", [id_user_access]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

export async function createUser(id_user,id_country, id_region, id_company, id_department) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO USER_ACCESS (id_user,id_country, id_region, id_company, id_department) VALUES (?, ?, ?,? ,?)",
      [id_user,id_country, id_region, id_company, id_department]
    );
    return Number(result.insertId);
  } finally {
    conn.release();
  }
}

export async function updateUser(id_user_access,id_user,id_country, id_region, id_company, id_department) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      "UPDATE USER_ACCESS SET id_user=?,id_country=?, id_region=?, id_company=?, id_department=? WHERE id_user_access = ?",
      [id_user_access, id_user,id_country, id_region, id_company, id_department]
    );
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function deleteUser(id_user_access) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query("DELETE FROM USER_ACCESS WHERE id_user_access = ?", [id_user_access]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}
