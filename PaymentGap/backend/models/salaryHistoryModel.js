import pool from '../db/connection.js';

export async function getAllSalaryHistories() {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM SALARY_HISTORY");
    conn.release();
    return rows;
  } catch (err) {
    console.error("Error in getAllSalaryHistories:", err);
    throw err;
  }
}

export async function getSalaryHistoryById(id_salary_history) {
  try {
    const conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM SALARY_HISTORY WHERE id_salary_history = ?",
      [id_salary_history]
    );
    conn.release();
    return rows.length > 0 ? rows[0] : null;
  } catch (err) {
    console.error("Error in getSalaryHistoryById:", err);
    throw err;
  }
}

export async function createSalaryHistory(id_employee, salary, start_date, end_date) {
  try {
    const conn = await pool.getConnection();
    try {
      const formatDate = (d) => new Date(d).toISOString().slice(0, 10); 
      const result = await conn.query(
        "INSERT INTO SALARY_HISTORY(id_employee, salary, start_date, end_date) VALUES (?, ?, ?, ?)",
        [id_employee, salary, formatDate(start_date), formatDate(end_date)]
      );
      return Number(result.insertId) || null;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in createSalaryHistory:", err);
    throw err;
  }
}

export async function updateSalaryHistory(id_salary_history, id_employee, salary, start_date, end_date) {
  try {
    const conn = await pool.getConnection();
    const formatDate = (d) => new Date(d).toISOString().slice(0, 10); 
    const result = await conn.query(
      "UPDATE SALARY_HISTORY SET id_employee = ?, salary = ?, start_date = ?, end_date = ? WHERE id_salary_history = ?",
      [id_employee, salary, formatDate(start_date), formatDate(end_date), id_salary_history]
    );
    conn.release();
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error in updateSalaryHistory:", err);
    throw err;
  }
}

export async function deleteSalaryHistory(id_salary_history) {
  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      "DELETE FROM SALARY_HISTORY WHERE id_salary_history = ?",
      [id_salary_history]
    );
    conn.release();
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error in deleteSalaryHistory:", err);
    throw err;
  }
}
