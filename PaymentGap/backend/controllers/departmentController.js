import {
    getAllDepartments,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
  } from '../models/departmentModel.js';
  
  export async function getDepartments(req, res) {
    try {
      const departments = await getAllDepartments();
      res.json(departments);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching departments" });
    }
  }
  
  export async function getDepartment(req, res) {
    const { id_department } = req.params;
    try {
      const department = await getDepartmentById(id_department);
      if (department) res.json(department);
      else res.status(404).json({ success: false, message: "Department not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching department" });
    }
  }
  
  export async function addDepartment(req, res) {
    const { id_company, department_name } = req.body;
    try {
      const departmentId = await createDepartment(id_company, department_name);
      if (departmentId) res.json({ success: true, departmentId });
      else res.status(500).json({ success: false, message: "Unable to create department" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating department" });
    }
  }
  
  export async function editDepartment(req, res) {
    const { id_department } = req.params;
    const { id_company, department_name } = req.body;
    try {
      const isUpdated = await updateDepartment(id_department, Number(id_company), department_name);
      if (isUpdated) res.json({ success: true, message: "Department updated successfully" });
      else res.status(404).json({ success: false, message: "Department not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating department" });
    }
  }
  
  
  export async function removeDepartment(req, res) {
    const { id_department } = req.params;
    try {
      const isDeleted = await deleteDepartment(id_department);
      if (isDeleted) res.json({ success: true, message: "Department deleted successfully" });
      else res.status(404).json({ success: false, message: "Department not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting department" });
    }
  }
  