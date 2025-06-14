import express from 'express';
import { getCompanyRegions, getCompanyRegion, addCompanyRegion, removeCompanyRegion } from '../controllers/companyRegionController.js';

const router = express.Router();

//http://localhost:3000/companyRegions/getCompanyRegions
router.get('/getCompanyRegions', getCompanyRegions);

//http://localhost:3000/companyRegions/getCompanyRegion/1
router.get('/getCompanyRegion/:id_region_company', getCompanyRegion);

//http://localhost:3000/companyRegions/addCompanyRegion
router.post('/addCompanyRegion', addCompanyRegion);

//http://localhost:3000/companyRegions/removeCompanyRegion/4
router.delete('/removeCompanyRegion/:id_region_company', removeCompanyRegion);

export default router;
