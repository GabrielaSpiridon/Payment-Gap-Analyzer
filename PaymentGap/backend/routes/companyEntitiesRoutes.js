import express from 'express';
import { getCompanyEntities, getCompanyEntity, addCompanyEntity, editCompanyEntity, removeCompanyEntity} from '../controllers/companyEntityController.js';

const router = express.Router();


//http://localhost:3000/companyEntities/getCompanyEntities
router.get('/getCompanyEntities', getCompanyEntities);

//http://localhost:3000/companyEntities/getCompanyEntity/1
router.get('/getCompanyEntity/:id_company_entity', getCompanyEntity);

//http://localhost:3000/companyEntities/addCompanyEntity
router.post('/addCompanyEntity', addCompanyEntity);

//http://localhost:3000/companyEntities/editCompanyEntity/4
router.put('/editCompanyEntity/:id_company_entity', editCompanyEntity);

//http://localhost:3000/companyEntities/removeCompanyEntity/4
router.delete('/removeCompanyEntity/:id_company_entity', removeCompanyEntity);

export default router;
