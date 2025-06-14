import pool from '../db/connection.js';

export async function getAllCompanyCountries() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES_COUNTRIES");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllCompanyCountries:", err);
    throw err;
  }
}

export async function getCompanyCountryById(id_country_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES_COUNTRIES WHERE id_country_company = ?", [id_country_company]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getCompanyCountryById:", err);
    throw err;
  }
}

export async function createCompanyCountry(id_country, id_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO COMPANIES_COUNTRIES(id_country, id_company) VALUES(?, ?)", [id_country, id_company]);
      return Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createCompanyCountry:", err);
    throw err;
  }
}

export async function deleteCompanyCountry(id_country_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM COMPANIES_COUNTRIES WHERE id_country_company = ?", [id_country_company]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteCompanyCountry:", err);
    throw err;
  }
}