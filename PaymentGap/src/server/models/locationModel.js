import pool from '../db/connection.js';

export async function getAllLocations() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM LOCATIONS");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllLocations:", err);
    throw err;
  }
}

export async function getLocationById(id_location) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM LOCATIONS WHERE id_location = ?", [id_location]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getLocationById:", err);
    throw err;
  }
}

export async function createLocation(id_country, city_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO LOCATIONS(id_country, city_name) VALUES(?, ?)", [id_country, city_name]);
      return Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createLocation:", err);
    throw err;
  }
}

export async function updateLocation(id_location, id_country, city_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("UPDATE LOCATIONS SET id_country = ?, city_name = ? WHERE id_location = ?", [id_country, city_name, id_location]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in updateLocation:", err);
    throw err;
  }
}

export async function deleteLocation(id_location) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM LOCATIONS WHERE id_location = ?", [id_location]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteLocation:", err);
    throw err;
  }
}
