import {
    getAllJobTitles,
    getJobTitleById,
    createJobTitle,
    updateJobTitle,
    deleteJobTitle
  } from '../models/jobTitleModel.js';
  
  export async function getJobTitles(req, res) {
    try {
      const jobs = await getAllJobTitles();
      res.json(jobs);
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching job titles" });
    }
  }
  
  export async function getJobTitle(req, res) {
    const { id_job_title } = req.params;
    try {
      const job = await getJobTitleById(id_job_title);
      if (job) res.json(job);
      else res.status(404).json({ success: false, message: "Job title not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error fetching job title" });
    }
  }
  
  export async function addJobTitle(req, res) {
    const { job_title, id_department, min_salary, max_salary } = req.body;
    try {
      const jobId = await createJobTitle(job_title, id_department, min_salary, max_salary);
      if (jobId) res.json({ success: true, jobId });
      else res.status(500).json({ success: false, message: "Unable to create job title" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error creating job title" });
    }
  }
  
  export async function editJobTitle(req, res) {
    const { id_job_title } = req.params;
    const { job_title, id_department, min_salary, max_salary } = req.body;
    try {
      const updated = await updateJobTitle(id_job_title, job_title, id_department, min_salary, max_salary);
      if (updated) res.json({ success: true, message: "Job title updated successfully" });
      else res.status(404).json({ success: false, message: "Job title not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error updating job title" });
    }
  }
  
  export async function removeJobTitle(req, res) {
    const { id_job_title } = req.params;
    try {
      const deleted = await deleteJobTitle(id_job_title);
      if (deleted) res.json({ success: true, message: "Job title deleted successfully" });
      else res.status(404).json({ success: false, message: "Job title not found" });
    } catch (err) {
      res.status(500).json({ success: false, message: "Error deleting job title" });
    }
  }
  