import { getAllCompanies, getCompanyById, createCompany, updateCompany, deleteCompany } from '../models/companyModel.js';

export async function getCompanies(req, res) {
  try {
    const companies = await getAllCompanies();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching companies" });
  }
}

export async function getCompany(req, res) {
  const { id_company } = req.params;
  try {
    const company = await getCompanyById(id_company);
    if (company) res.json(company);
    else res.status(404).json({ success: false, message: "Company not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching company" });
  }
}

export async function addCompany(req, res) {
  const { company_name } = req.body;
  try {
    const companyId = await createCompany(company_name);
    if (companyId) res.json({ success: true, companyId });
    else res.status(500).json({ success: false, message: "Unable to create company" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating company" });
  }
}

export async function editCompany(req, res) {
  const { id_company } = req.params;
  const { company_name } = req.body;
  try {
    const isUpdated = await updateCompany(id_company, company_name);
    if (isUpdated) res.json({ success: true, message: "Company updated successfully" });
    else res.status(404).json({ success: false, message: "Company not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating company" });
  }
}

export async function removeCompany(req, res) {
  const { id_company } = req.params;
  try {
    const isDeleted = await deleteCompany(id_company);
    if (isDeleted) res.json({ success: true, message: "Company deleted successfully" });
    else res.status(404).json({ success: false, message: "Company not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting company" });
  }
}