import {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  } from '../models/userAccessModel.js';
  
  export async function getUsers(req, res) {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching users" });
    }
  }
  
  export async function getUser(req, res) {
    const { id_user_access } = req.params;
    try {
      const user = await getUserById(id_user_access);
      if (user) res.json(user);
      else res.status(404).json({ success: false, message: "User not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching user" });
    }
  }
  
  export async function addUser(req, res) {
    const { id_user,id_country, id_region, id_company, id_department } = req.body;
    try {
      const userId = await createUser(id_user,id_country, id_region, id_company, id_department);
      res.json({ success: true, userId });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating user" });
    }
  }
  
  export async function editUser(req, res) {
    const { id_user_access } = req.params;
    const { id_user,id_country, id_region, id_company, id_department} = req.body;
    try {
      const isUpdated = await updateUser(id_user_access,id_user,id_country, id_region, id_company, id_department);
      if (isUpdated) res.json({ success: true, message: "User updated successfully" });
      else res.status(404).json({ success: false, message: "User not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating user" });
    }
  }
  
  export async function removeUser(req, res) {
    const { id_user } = req.params;
    try {
      const isDeleted = await deleteUser(id_user);
      if (isDeleted) res.json({ success: true, message: "User deleted successfully" });
      else res.status(404).json({ success: false, message: "User not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting user" });
    }
  }
  