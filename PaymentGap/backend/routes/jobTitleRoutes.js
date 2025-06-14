import express from 'express';
import {getJobTitles,  getJobTitle, addJobTitle,  editJobTitle,  removeJobTitle} from '../controllers/jobTitleController.js';

const router = express.Router();

// http://localhost:3000/jobTitles/getJobTitles
router.get('/getJobTitles', getJobTitles);

// http://localhost:3000/jobTitles/getJobTitle/1
router.get('/getJobTitle/:id_job_title', getJobTitle);

// http://localhost:3000/jobTitles/addJobTitle
router.post('/addJobTitle', addJobTitle);

//http://localhost:3000/jobTitles/editJobTitle/4
router.put('/editJobTitle/:id_job_title', editJobTitle);

// http://localhost:3000/jobTitles/removeJobTitle/4
router.delete('/removeJobTitle/:id_job_title', removeJobTitle);

export default router;
