import pool from '../db/connection.js';

export async function getAllJobTitles() {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM JOB_TITLE");
      return rows;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in getAllJobTitles:", err);
    throw err;
  }
}

export async function getJobTitleById(id_job_title) {
  try {
    const conn = await pool.getConnection();
    try {
      const rows = await conn.query("SELECT * FROM JOB_TITLE WHERE id_job_title = ?", [id_job_title]);
      return rows.length > 0 ? rows[0] : null;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in getJobTitleById:", err);
    throw err;
  }
}

export async function createJobTitle(job_title, id_department, min_salary, max_salary) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        "INSERT INTO JOB_TITLE(job_title, id_department, min_salary, max_salary) VALUES (?, ?, ?, ?)",
        [job_title, id_department, min_salary, max_salary]
      );
      return Number(result.insertId) || null;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in createJobTitle:", err);
    throw err;
  }
}

export async function updateJobTitle(id_job_title, job_title, id_department, min_salary, max_salary) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query(
        "UPDATE JOB_TITLE SET job_title = ?, id_department = ?, min_salary = ?, max_salary = ? WHERE id_job_title = ?",
        [job_title, id_department, min_salary, max_salary, id_job_title]
      );
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in updateJobTitle:", err);
    throw err;
  }
}

export async function deleteJobTitle(id_job_title) {
  try {
    const conn = await pool.getConnection();
    try {
      const result = await conn.query("DELETE FROM JOB_TITLE WHERE id_job_title = ?", [id_job_title]);
      return result.affectedRows > 0;
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("Error in deleteJobTitle:", err);
    throw err;
  }
}
