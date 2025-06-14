import express from 'express';
import { getCountries, getCountry, addCountry, editCountry, removeCountry } from '../controllers/countryController.js';

const router = express.Router();

//http://localhost:3000/countries/getCountries
router.get('/getCountries', getCountries);

//http://localhost:3000/countries/getCountry/2
router.get('/getCountry/:id_country', getCountry);

//http://localhost:3000/countries/addCountry
router.post('/addCountry', addCountry);

//http://localhost:3000/countries/editCountry/8
router.put('/editCountry/:id_country', editCountry);

//http://localhost:3000/countries/removeCountry/7
router.delete('/removeCountry/:id_country', removeCountry);

export default router;
