import express from 'express';
import { getAllRegionsCtrl, getOneRegionCtrl, addRegionCtrl, editRegionCtrl, removeRegionCtrl } from '../controllers/regionController.js';

const router = express.Router();

//http://localhost:3000/regions/getAllRegions
router.get('/getAllRegions', getAllRegionsCtrl);

http://localhost:3000/regions/getOneRegion/2
router.get('/getOneRegion/:id_region', getOneRegionCtrl);

//http://localhost:3000/regions/addRegion
router.post('/addRegion', addRegionCtrl);

//http://localhost:3000/regions/editRegion/4
router.put('/editRegion/:id_region', editRegionCtrl);

//http://localhost:3000/regions/removeRegion/4
router.delete('/removeRegion/:id_region', removeRegionCtrl);

export default router;
