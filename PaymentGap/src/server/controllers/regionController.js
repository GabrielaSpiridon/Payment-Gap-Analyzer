import { getAllRegions, getRegionById, createRegion, updateRegion, deleteRegion } from '../models/regionModel.js';

export async function getAllRegionsCtrl(req, res) {
    try {
        const regions = await getAllRegions(); 
        res.json(regions);
    } catch (err) {
        console.error('Eroare în getAllRegionsCtrl:', err);
        res.status(500).json({ success: false, message: "Error fetching regions" });
    }
}

export async function getOneRegionCtrl(req, res) {
  const { id_region } = req.params;
  try {
    const region = await getRegionById(id_region);
    if (region) res.json(region);
    else res.status(404).json({ success: false, message: "Region not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching region" });
  }
}

export async function addRegionCtrl(req, res) {
  const { region_name } = req.body;
  try {
    const regionId = await createRegion(region_name);
    if (regionId) {
      res.json({ success: true, regionId });
    } else {
      res.status(500).json({ success: false, message: "Unable to create region" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error creating region" });
  }
}


export async function editRegionCtrl(req, res) {
  const { id_region } = req.params;
  const { region_name } = req.body;
  try {
    const isUpdated = await updateRegion(id_region, region_name);
    if (isUpdated) res.json({ success: true, message: "Region updated successfully" });
    else res.status(404).json({ success: false, message: "Region not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating region" });
  }
}

export async function removeRegionCtrl(req, res) {
  const { id_region } = req.params;
  try {
    const isDeleted = await deleteRegion(id_region);
    if (isDeleted) res.json({ success: true, message: "Region deleted successfully" });
    else res.status(404).json({ success: false, message: "Region not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting region" });
  }
}
