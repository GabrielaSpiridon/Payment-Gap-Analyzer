import pool from '../db/connection.js';

export async function getAllCountries() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COUNTRIES");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllCountries:", err);
    throw err;
  }
}

export async function getCountryById(id_country) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM COUNTRIES WHERE id_country = ?", [id_country]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getCountryById:", err);
    throw err;
  }
}

export async function createCountry(country_name, id_region) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO COUNTRIES(country_name, id_region) VALUES(?, ?)", [country_name, id_region]);
      return  Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createCountry:", err);
    throw err;
  }
}

export async function updateCountry(id_country, country_name, id_region) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("UPDATE COUNTRIES SET country_name = ?, id_region = ? WHERE id_country = ?", [country_name, id_region, id_country]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in updateCountry:", err);
    throw err;
  }
}

export async function deleteCountry(id_country) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM COUNTRIES WHERE id_country = ?", [id_country]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteCountry:", err);
    throw err;
  }
}