import pool from '../db/connection.js';
import { format } from 'date-fns';

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

export async function createEmployee(employeeData) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      `INSERT INTO EMPLOYEES (first_name, second_name, email, phone, employment_date, id_job_title, salary, gender, national_id, date_of_birth, nationality, id_line_manager, id_compensation_manager, id_department)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeData.first_name,
        employeeData.second_name,
        employeeData.email,
        employeeData.phone,
        employeeData.employment_date,
        employeeData.id_job_title,
        employeeData.salary,
        employeeData.gender,
        employeeData.national_id,
        employeeData.date_of_birth,
        employeeData.nationality,
        employeeData.id_line_manager,
        employeeData.id_compensation_manager,
        employeeData.id_department
      ]
    );
    return Number(result.insertId); 
  } catch (err) {
    throw err;
  } finally {
    connection.release();
  }
}


export async function updateEmployee(id, data) {
  const {
    first_name, second_name, email, phone,
    employment_date, id_job_title, salary,
    gender, national_id, date_of_birth, nationality,
    id_line_manager, id_compensation_manager, id_department
  } = data;

  const conn = await pool.getConnection();
  try {
    const formattedEmploymentDate = employment_date ? format(new Date(employment_date), 'yyyy-MM-dd') : null;
    const formattedDob = date_of_birth ? format(new Date(date_of_birth), 'yyyy-MM-dd') : null;

    const result = await conn.query(
      `UPDATE EMPLOYEES SET
        first_name = ?, second_name = ?, email = ?, phone = ?,
        employment_date = ?, id_job_title = ?, salary = ?,
        gender = ?, national_id = ?, date_of_birth = ?, nationality = ?,
        id_line_manager = ?, id_compensation_manager = ?, id_department = ?
      WHERE id_employee = ?`,
      [
        first_name, second_name, email, phone,
        formattedEmploymentDate, id_job_title, salary,
        gender, national_id, formattedDob, nationality,
        id_line_manager, id_compensation_manager, id_department,
        id
      ]
    );
    return result.affectedRows;
  } finally {
    conn.release();
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
