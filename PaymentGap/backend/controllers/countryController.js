import { getAllCountries, getCountryById, createCountry, updateCountry, deleteCountry } from '../models/countryModel.js';

export async function getCountries(req, res) {
  try {
    const countries = await getAllCountries();
    res.json(countries);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching countries" });
  }
}

export async function getCountry(req, res) {
  const { id_country } = req.params;
  try {
    const country = await getCountryById(id_country);
    if (country) res.json(country);
    else res.status(404).json({ success: false, message: "Country not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching country" });
  }
}

export async function addCountry(req, res) {
  const { country_name, id_region } = req.body;
  try {
    const countryId = await createCountry(country_name, id_region);
    if (countryId) res.json({ success: true, countryId });
    else res.status(500).json({ success: false, message: "Unable to create country" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating country" });
  }
}

export async function editCountry(req, res) {
  const { id_country } = req.params;
  const { country_name, id_region } = req.body;
  try {
    const isUpdated = await updateCountry(id_country, country_name, id_region);
    if (isUpdated) res.json({ success: true, message: "Country updated successfully" });
    else res.status(404).json({ success: false, message: "Country not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating country" });
  }
}

export async function removeCountry(req, res) {
  const { id_country } = req.params;
  try {
    const isDeleted = await deleteCountry(id_country);
    if (isDeleted) res.json({ success: true, message: "Country deleted successfully" });
    else res.status(404).json({ success: false, message: "Country not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting country" });
  }
}