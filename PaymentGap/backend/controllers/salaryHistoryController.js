import {
    getAllSalaryHistories,
    getSalaryHistoryById,
    createSalaryHistory,
    updateSalaryHistory,
    deleteSalaryHistory
  } from '../models/salaryHistoryModel.js';
  
  export async function getSalaryHistories(req, res) {
    try {
      const salaries = await getAllSalaryHistories();
      res.json(salaries);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching salary histories" });
    }
  }
  
  export async function getSalaryHistory(req, res) {
    const { id_salary_history } = req.params;
    try {
      const salary = await getSalaryHistoryById(id_salary_history);
      if (salary) res.json(salary);
      else res.status(404).json({ success: false, message: "Salary history not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching salary history" });
    }
  }
  
  export async function addSalaryHistory(req, res) {
    const { id_employee, salary, start_date, end_date } = req.body;
    try {
      const id = await createSalaryHistory(id_employee, salary, start_date, end_date);
      if (id) res.json({ success: true, id });
      else res.status(500).json({ success: false, message: "Unable to create salary history" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating salary history" });
    }
  }
  
  export async function editSalaryHistory(req, res) {
    const { id_salary_history } = req.params;
    const { id_employee, salary, start_date, end_date } = req.body;
    try {
      const updated = await updateSalaryHistory(id_salary_history, id_employee, salary, start_date, end_date);
      if (updated) res.json({ success: true, message: "Salary history updated successfully" });
      else res.status(404).json({ success: false, message: "Salary history not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating salary history" });
    }
  }
  
  export async function removeSalaryHistory(req, res) {
    const { id_salary_history } = req.params;
    try {
      const deleted = await deleteSalaryHistory(id_salary_history);
      if (deleted) res.json({ success: true, message: "Salary history deleted successfully" });
      else res.status(404).json({ success: false, message: "Salary history not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting salary history" });
    }
  }
  