import pool from '../db/connection.js';

export async function getAllCompanyRegions() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES_REGIONS");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllCompanyRegions:", err);
    throw err;
  }
}

export async function getCompanyRegionById(id_region_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COMPANIES_REGIONS WHERE id_region_company = ?", [id_region_company]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getCompanyRegionById:", err);
    throw err;
  }
}

export async function createCompanyRegion(id_region, id_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO COMPANIES_REGIONS(id_region, id_company) VALUES(?, ?)", [id_region, id_company]);
      return Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createCompanyRegion:", err);
    throw err;
  }
}

export async function deleteCompanyRegion(id_region_company) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM COMPANIES_REGIONS WHERE id_region_company = ?", [id_region_company]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteCompanyRegion:", err);
    throw err;
  }
}