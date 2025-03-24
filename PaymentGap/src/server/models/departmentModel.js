import pool from '../db/connection.js';

export async function getAllDepartments() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM DEPARTMENTS");
      return rows;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getAllDepartments:", err);
    throw err;
  }
}

export async function getDepartmentById(id_department) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM DEPARTMENTS WHERE id_department = ?", [id_department]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in getDepartmentById:", err);
    throw err;
  }
}

export async function createDepartment(id_company, department_name) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("INSERT INTO DEPARTMENTS(id_company, department_name) VALUES(?, ?)", [id_company, department_name]);
      return Number(result.insertId) || null;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in createDepartment:", err);
    throw err;
  }
}

export async function updateDepartment(id_department, id_company, department_name) {
    try {
      const conn = await pool.getConnection();
      try {
        const result = await conn.query(
          "UPDATE DEPARTMENTS SET id_company = ?, department_name = ? WHERE id_department = ?",
          [parseInt(id_company), department_name, parseInt(id_department)]
        );
        return result.affectedRows > 0;
      } finally {
        conn.release();
      }
    } catch (err) {
      console.error("Error in updateDepartment:", err);
      throw err;
    }
  }
  

export async function deleteDepartment(id_department) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM DEPARTMENTS WHERE id_department = ?", [id_department]);
      return result.affectedRows > 0;
    } finally {
      if (conn) conn.release();
    }
  } catch (err) {
    console.error("Error in deleteDepartment:", err);
    throw err;
  }
}
