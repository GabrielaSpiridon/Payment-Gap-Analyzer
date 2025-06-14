import { getAllCompanyCountries, getCompanyCountryById, createCompanyCountry, deleteCompanyCountry } from '../models/companyCountryModel.js';

export async function getCompanyCountries(req, res) {
  try {
    const companyCountries = await getAllCompanyCountries();
    res.json(companyCountries);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching company countries" });
  }
}

export async function getCompanyCountry(req, res) {
  const { id_country_company } = req.params;
  try {
    const companyCountry = await getCompanyCountryById(id_country_company);
    if (companyCountry) res.json(companyCountry);
    else res.status(404).json({ success: false, message: "Company country not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching company country" });
  }
}

export async function addCompanyCountry(req, res) {
  const { id_country, id_company } = req.body;
  try {
    const countryCompanyId = await createCompanyCountry(id_country, id_company);
    if (countryCompanyId) res.json({ success: true, countryCompanyId });
    else res.status(500).json({ success: false, message: "Unable to create company country" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating company country" });
  }
}

export async function removeCompanyCountry(req, res) {
  const { id_country_company } = req.params;
  try {
    const isDeleted = await deleteCompanyCountry(id_country_company);
    if (isDeleted) res.json({ success: true, message: "Company country deleted successfully" });
    else res.status(404).json({ success: false, message: "Company country not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting company country" });
  }
}