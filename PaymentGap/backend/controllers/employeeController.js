import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeByEmail
} from '../models/employeeModel.js';

export async function getEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching employees" });
  }
}

export async function getEmployee(req, res) {
  const { id } = req.params;
  try {
    const employee = await getEmployeeById(id);
    if (employee) res.json(employee);
    else res.status(404).json({ success: false, message: "Employee not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching employee" });
  }
}

export async function addEmployee(req, res) {
  try {
    const id = await createEmployee(req.body);
    res.json({ success: true, id });
  } catch (err) {
    console.error("EROARE LA CREARE:", err);
    res.status(500).json({ success: false, message: "Error creating employee" });
  }
}


export async function editEmployee(req, res) {
  const { id } = req.params;
  const employeeData = req.body;
  try {
    const isUpdated = await updateEmployee(id, employeeData);
    if (isUpdated) res.json({ success: true, message: "Employee updated successfully" });
    else res.status(404).json({ success: false, message: "Employee not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating employee" });
  }
}

export async function removeEmployee(req, res) {
  const { id } = req.params;
  try {
    const isDeleted = await deleteEmployee(id);
    if (isDeleted) res.json({ success: true, message: "Employee deleted successfully" });
    else res.status(404).json({ success: false, message: "Employee not found" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting employee" });
  }
}

export async function getEmployeeByEmailController(req, res) {
  let { email } = req.query;
  if (!email) {
    return res.status(400).json({ success: false, message: "Email is required" });
  }
  email = email.trim(); 
  try {
    const employee = await getEmployeeByEmail(email);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ success: false, message: "Employee not found" });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching employee by email" });
  }
}


