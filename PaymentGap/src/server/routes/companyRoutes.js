import express from 'express';
import { getCompanies, getCompany, addCompany, editCompany, removeCompany } from '../controllers/companyController.js';

const router = express.Router();

//http://localhost:3000/companies/getCompanies
router.get('/getCompanies', getCompanies);

//http://localhost:3000/companies/getCompany/1
router.get('/getCompany/:id_company', getCompany);

//http://localhost:3000/companies/addCompany
router.post('/addCompany', addCompany);

//http://localhost:3000/companies/editCompany/4
router.put('/editCompany/:id_company', editCompany);

//http://localhost:3000/companies/removeCompany/4
router.delete('/removeCompany/:id_company', removeCompany);

export default router;
