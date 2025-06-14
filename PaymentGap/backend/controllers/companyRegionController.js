import { getAllCompanyRegions, getCompanyRegionById, createCompanyRegion, deleteCompanyRegion } from '../models/companyRegionModel.js';

export async function getCompanyRegions(req, res) {
  try {
    const companyRegions = await getAllCompanyRegions();
    res.json(companyRegions);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching company regions" });
  }
}

export async function getCompanyRegion(req, res) {
  const { id_region_company } = req.params;
  try {
    const companyRegion = await getCompanyRegionById(id_region_company);
    if (companyRegion) res.json(companyRegion);
    else res.status(404).json({ success: false, message: "Company region not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching company region" });
  }
}

export async function addCompanyRegion(req, res) {
  const { id_region, id_company } = req.body;
  try {
    const regionCompanyId = await createCompanyRegion(id_region, id_company);
    if (regionCompanyId) res.json({ success: true, regionCompanyId });
    else res.status(500).json({ success: false, message: "Unable to create company region" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating company region" });
  }
}

export async function removeCompanyRegion(req, res) {
  const { id_region_company } = req.params;
  try {
    const isDeleted = await deleteCompanyRegion(id_region_company);
    if (isDeleted) res.json({ success: true, message: "Company region deleted successfully" });
    else res.status(404).json({ success: false, message: "Company region not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting company region" });
  }
}