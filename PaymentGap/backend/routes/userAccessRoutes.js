import express from 'express';
import {
  getUsers,
  getUser,
  addUser,
  editUser,
  removeUser
} from '../controllers/userAccessController.js';

const router = express.Router();

//http://localhost:3000/userAccess/getUsers
router.get('/getUsers', getUsers);


//http://localhost:3000/userAccess/getUser/1
router.get('/getUser/:id_user_access', getUser);


//http://localhost:3000/userAccess/addUser
router.post('/addUser', addUser);


//http://localhost:3000/userAccess/editUser/4
router.put('/editUser/:id_user', editUser);


//http://localhost:3000/userAccess/removeUser/4
router.delete('/removeUser/:id_user', removeUser);

export default router;
