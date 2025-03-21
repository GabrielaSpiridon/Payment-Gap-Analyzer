import pool from '../db/connection.js';

export async function getAllCompanies() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllCompanies:", err);
    throw err;
  }
}

export async function getCompanyById(id_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES WHERE id_company = ?", [id_company]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getCompanyById:", err);
    throw err;
  }
}

export async function createCompany(company_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO COMPANIES(company_name) VALUES(?)", [company_name]);
      return Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createCompany:", err);
    throw err;
  }
}

export async function updateCompany(id_company, company_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("UPDATE COMPANIES SET company_name = ? WHERE id_company = ?", [company_name, id_company]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in updateCompany:", err);
    throw err;
  }
}

export async function deleteCompany(id_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM COMPANIES WHERE id_company = ?", [id_company]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteCompany:", err);
    throw err;
  }
}