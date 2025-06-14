import {
    getAllCompanyEntities,
    getCompanyEntityById,
    createCompanyEntity,
    updateCompanyEntity,
    deleteCompanyEntity
  } from '../models/companyEntityModel.js';
  
  export async function getCompanyEntities(req, res) {
    try {
      const data = await getAllCompanyEntities();
      res.json(data);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error retrieving company entities" });
    }
  }
  
  export async function getCompanyEntity(req, res) {
    const { id_company_entity } = req.params;
    try {
      const data = await getCompanyEntityById(id_company_entity);
      if (data) res.json(data);
      else res.status(404).json({ success: false, message: "Company entity not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error retrieving company entity" });
    }
  }
  
  export async function addCompanyEntity(req, res) {
    try {
      const id = await createCompanyEntity(req.body);
      res.json({ success: true, id });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error adding company entity" });
    }
  }
  
  export async function editCompanyEntity(req, res) {
    const { id_company_entity } = req.params;
    try {
      const ok = await updateCompanyEntity(id_company_entity, req.body);
      if (ok) res.json({ success: true, message: "Company entity updated successfully" });
      else res.status(404).json({ success: false, message: "Company entity not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating company entity" });
    }
  }
  
  export async function removeCompanyEntity(req, res) {
    const { id_company_entity } = req.params;
    try {
      const ok = await deleteCompanyEntity(id_company_entity);
      if (ok) res.json({ success: true, message: "Company entity deleted successfully" });
      else res.status(404).json({ success: false, message: "Company entity not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting company entity" });
    }
  }
  