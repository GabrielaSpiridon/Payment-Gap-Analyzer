import { getAllLocations, getLocationById, createLocation, updateLocation, deleteLocation } from '../models/locationModel.js';

export async function getLocations(req, res) {
  try {
    const locations = await getAllLocations();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching locations" });
  }
}

export async function getLocation(req, res) {
  const { id_location } = req.params;
  try {
    const location = await getLocationById(id_location);
    if (location) res.json(location);
    else res.status(404).json({ success: false, message: "Location not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching location" });
  }
}

export async function addLocation(req, res) {
  const { id_country, city_name } = req.body;
  try {
    const locationId = await createLocation(id_country, city_name);
    if (locationId) res.json({ success: true, locationId });
    else res.status(500).json({ success: false, message: "Unable to create location" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating location" });
  }
}

export async function editLocation(req, res) {
  const { id_location } = req.params;
  const { id_country, city_name } = req.body;
  try {
    const isUpdated = await updateLocation(id_location, id_country, city_name);
    if (isUpdated) res.json({ success: true, message: "Location updated successfully" });
    else res.status(404).json({ success: false, message: "Location not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating location" });
  }
}

export async function removeLocation(req, res) {
  const { id_location } = req.params;
  try {
    const isDeleted = await deleteLocation(id_location);
    if (isDeleted) res.json({ success: true, message: "Location deleted successfully" });
    else res.status(404).json({ success: false, message: "Location not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting location" });
  }
}