import express from 'express';
import { getCompanyCountries, getCompanyCountry, addCompanyCountry, removeCompanyCountry } from '../controllers/companyCountryController.js';

const router = express.Router();

//http://localhost:3000/companyCountries/getCompanyCountries
router.get('/getCompanyCountries', getCompanyCountries);

//http://localhost:3000/companyCountries/getCompanyCountry/1
router.get('/getCompanyCountry/:id_country_company', getCompanyCountry);

//http://localhost:3000/companyCountries/addCompanyCountry
router.post('/addCompanyCountry', addCompanyCountry);

//http://localhost:3000/companyCountries/removeCompanyCountry/4
router.delete('/removeCompanyCountry/:id_country_company', removeCompanyCountry);

export default router;
