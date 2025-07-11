import pool from '../db/connection.js';

export async function getAllCompanyEntities() {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM company_entities");
    return rows;
  } finally {
    conn.release();
  }
}

export async function getCompanyEntityById(id) {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM company_entities WHERE id_company_entity = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
  } finally {
    conn.release();
  }
}

export async function createCompanyEntity(data) {
  const {
    company_entity_name, id_region, id_country, id_company,
    id_department, id_manager
  } = data;

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `INSERT INTO company_entities 
        (company_entity_name, id_region, id_country, id_company, id_department, id_manager)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [company_entity_name, id_region, id_country, id_company, id_department, id_manager]
    );
    return Number(result.insertId);
  } finally {
    conn.release();
  }
}

export async function updateCompanyEntity(id, data) {
  const {
    company_entity_name, id_region, id_country, id_company,
    id_department, id_manager, id_manager_type, id_structure
  } = data;

  const conn = await pool.getConnection();
  try {
    const result = await conn.query(
      `UPDATE company_entities SET 
        company_entity_name = ?, id_region = ?, id_country = ?, id_company = ?, 
        id_department = ?, id_manager = ?
       WHERE id_company_entity = ?`,
      [company_entity_name, id_region, id_country, id_company, id_department, id_manager,  id]
    ); 
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}

export async function deleteCompanyEntity(id) {
  const conn = await pool.getConnection();
  try {
    const result = await conn.query("DELETE FROM company_entities WHERE id_company_entity = ?", [id]);
    return result.affectedRows > 0;
  } finally {
    conn.release();
  }
}
