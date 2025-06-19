import express from 'express';
import {getEmployees, getEmployee, addEmployee, editEmployee,removeEmployee, getEmployeeByEmailController} from '../controllers/employeeController.js';

const router = express.Router();

//http://localhost:3000/employees/getAllEmployees
router.get('/getAllEmployees', getEmployees);

//http://localhost:3000/employees/getEmployee/1
router.get('/getEmployee/:id', getEmployee);

//http://localhost:3000/employees/addEmployee
router.post('/addEmployee', addEmployee);

//http://localhost:3000/employees/editEmployee/5
router.put('/editEmployee/:id', editEmployee);

//http://localhost:3000/employees/removeEmployees/4
router.delete('/removeEmployees/:id', removeEmployee);

//http://localhost:3000/employees/getEmployeeByEmail
router.get('/getEmployeeByEmail', getEmployeeByEmailController);


export default router;
