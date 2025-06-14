import express from 'express';
import {
  getDepartments,
  getDepartment,
  addDepartment,
  editDepartment,
  removeDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

//http://localhost:3000/departments/getDepartments
router.get('/getDepartments', getDepartments);

//http://localhost:3000/departments/getDepartment/1
router.get('/getDepartment/:id_department', getDepartment);

//http://localhost:3000/departments/addDepartment
router.post('/addDepartment', addDepartment);

//http://localhost:3000/departments/editDepartment/4
router.put('/editDepartment/:id_department', editDepartment);

//http://localhost:3000/departments/removeDepartment/4
router.delete('/removeDepartment/:id_department', removeDepartment);

export default router;
