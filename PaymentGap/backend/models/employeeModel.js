import pool from '../db/connection.js';

export async function getAllEmployees() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM EMPLOYEES');
    return rows;
  } finally {
    conn.release();
  }
}

export async function getEmployeeById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query('SELECT * FROM EMPLOYEES WHERE id_employee = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}


export async function createEmployee(employee) {
  const {
    first_name, second_name, email, phone, employment_date,
    id_job_title, salary, gender, national_id, date_of_birth,
    nationality, id_line_manager, id_compensation_manager, id_department
  } = employee;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `INSERT INTO EMPLOYEES 
        (first_name, second_name, email, phone, employment_date, 
         id_job_title, salary, gender, national_id, date_of_birth, 
         nationality, id_line_manager, id_compensation_manager, id_department)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, second_name, email, phone, employment_date,
        id_job_title, salary, gender, national_id, date_of_birth,
        nationality, id_line_manager, id_compensation_manager, id_department]
    );
    conn.release();
    return Number(result.insertId);
  } catch (err) {
    console.error("Error in createEmployee:", err);
    throw err;
  }
}

export async function getEmployeeByEmail(email) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      'SELECT first_name, second_name FROM EMPLOYEES WHERE email = ? LIMIT 1',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}


export async function updateEmployee(id, employee) {
  const {
    first_name, second_name, email, phone, employment_date,
    id_job_title, salary, gender, national_id, date_of_birth,
    nationality, id_line_manager, id_compensation_manager, id_department
  } = employee;

  try {
    const conn = await pool.getConnection();
    const result = await conn.query(
      `UPDATE EMPLOYEES SET 
        first_name = ?, second_name = ?, email = ?, phone = ?, employment_date = ?, 
        id_job_title = ?, salary = ?, gender = ?, national_id = ?, date_of_birth = ?, 
        nationality = ?, id_line_manager = ?, id_compensation_manager = ?, id_department = ?
       WHERE id_employee = ?`,
      [first_name, second_name, email, phone, employment_date,
        id_job_title, salary, gender, national_id, date_of_birth,
        nationality, id_line_manager, id_compensation_manager, id_department, id]
    );
    conn.release();
    return result.affectedRows > 0;
  } catch (err) {
    console.error("Error in updateEmployee:", err);
    throw err;
  }
}

export async function deleteEmployee(id) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query('DELETE FROM EMPLOYEES WHERE id_employee = ?', [id]);
    return result.affectedRows;
  } finally {
    conn.release();
  }
}
