import pool from '../db/connection.js';

export async function getAllRegions() {
  try {
      const conn = await pool.getConnection();
      console.log("Conexiune la baza de date realizată cu succes.");
      try {
          const rows = await conn.query("SELECT * FROM REGIONS");
          return rows;
      } finally {
          if (conn) conn.release();
      }
  } catch (err) {
      console.error("Error in getAllRegions:", err);
      throw err;
  }
}

export async function getRegionById(id_region) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM REGIONS WHERE id_region = ?", [id_region]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getRegionById:", err);
    throw err;
  }
}

export async function createRegion(region_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO REGIONS(region_name) VALUES(?)", [region_name]);
      return Number(result.insertId) || null;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in createRegion:", err);
    throw err;
  }
}


export async function updateRegion(id_region, region_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("UPDATE REGIONS SET region_name = ? WHERE id_region = ?", [region_name, id_region]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in updateRegion:", err);
    throw err;
  }
}

export async function deleteRegion(id_region) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM REGIONS WHERE id_region = ?", [id_region]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteRegion:", err);
    throw err;
  }
}