import express from 'express';
import { getLocations, getLocation, addLocation, editLocation, removeLocation } from '../controllers/locationController.js';

const router = express.Router();

//http://localhost:3000/locations/getLocations
router.get('/getLocations', getLocations);

//http://localhost:3000/locations/getLocation/1
router.get('/getLocation/:id_location', getLocation);

//http://localhost:3000/locations/addLocation
router.post('/addLocation', addLocation);

//http://localhost:3000/locations/editLocation/4
router.put('/editLocation/:id_location', editLocation);

//http://localhost:3000/locations/removeLocation/4
router.delete('/removeLocation/:id_location', removeLocation);

export default router;