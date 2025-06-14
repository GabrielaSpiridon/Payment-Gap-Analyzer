import express from 'express';
import { getSalaryHistories, getSalaryHistory, addSalaryHistory, editSalaryHistory, removeSalaryHistory } from '../controllers/salaryHistoryController.js';

const router = express.Router();

//http://localhost:3000/salaryHistories/getSalaryHistories
router.get('/getSalaryHistories', getSalaryHistories);

//http://localhost:3000/salaryHistories/getSalaryHistory/1
router.get('/getSalaryHistory/:id_salary_history', getSalaryHistory);

//http://localhost:3000/salaryHistories/addSalaryHistory
router.post('/addSalaryHistory', addSalaryHistory);

//http://localhost:3000/salaryHistories/editSalaryHistory/5
router.put('/editSalaryHistory/:id_salary_history', editSalaryHistory);

//http://localhost:3000/salaryHistories/removeSalaryHistory/5
router.delete('/removeSalaryHistory/:id_salary_history', removeSalaryHistory);

export default router;
