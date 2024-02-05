import { response } from "express";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import User from "../../../DB/models/user.model.js";
import Application from "../../../DB/models/application.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import generateUniqueString from "../../utils/generateUniqueString.js";

//================================== Add Job ==================================//
/**
 * * destructing data from req.body and req.headers
 * * check user already exists (addedBy)
 * * check company already exists (companyId)
 * * create new Job and check is created
 * * response successfully
 */
export const addJob = async (req, res, next) => {
  // * destructing data from req.body and req.headers
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
    companyId,
  } = req.body;
  const { _id } = req.authUser;

  // * check user already exists (addedBy)
  const user = await User.findById({ _id: addedBy });
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * check company already exists (companyId)
  const company = await Company.findById({ _id: companyId });
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * create new Job and check is created
  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy,
    companyId,
  });
  if (!job) return next(new Error("Job not created", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "Job created successfully", job });
};

//================================== Update Job ==================================//
/**
 * * destructing data from req.body and req.headers and req.query
 * * check if companyId already exists
 * * check if addedBy === _id <= user logged in
 * * check company already exists (companyId)
 * * update job and check if job updated successfully
 * * response successfully
 */
export const updateJob = async (req, res, next) => {
  // * destructing data from req.body and req.headers and req.query
  const {
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    companyId,
  } = req.body;
  const { _id } = req.authUser;
  const { jobId } = req.query;

  // * check if jobId already exists
  const job = await Job.findById({ _id: jobId });
  if (!job) return next(new Error("job not found", { cause: 400 }));
  console.log(job);
  console.log(_id);
  // * check if addedBy === _id <= user logged in
  if (!_id.equals(job.addedBy))
    return next(new Error("cant update job", { cause: 400 }));

  // * check company already exists (companyId)
  const company = await Company.findById({ _id: companyId });
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * update job and check if job updated successfully
  const jobUpdated = await Job.findByIdAndUpdate(
    { _id: jobId },
    {
      jobTitle,
      jobLocation,
      workingTime,
      seniorityLevel,
      jobDescription,
      technicalSkills,
      softSkills,
      companyId,
    }
  );
  if (!jobUpdated) return next(new Error("job not updated", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "updated Job", jobUpdated });
};

//================================== Delete Company ==================================//
/**
 * * destructing data from req.headers and req.query
 * * find the job and check if the User is Owner
 * * delete job and check is deleted
 * * response successfully
 */
export const deleteJob = async (req, res, next) => {
  // * destructing data from req.headers and req.query
  const { _id } = req.authUser;
  const { jobId } = req.query;

  // * find the job and check if the User is Owner
  const job = await Job.findById({ _id: jobId });
  if (!_id.equals(job.addedBy))
    return next(new Error("You cannot delete a job", { cause: 400 }));

  // * delete job and check is deleted
  const jobDeleted = await Job.findByIdAndDelete({ _id: jobId });
  if (!jobDeleted) return next(new Error("deleted faild", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "deleted success", jobDeleted });
};

//================================== Get All Jobs With Their Company ==================================//
/**
 * * destructing data from req.headers
 * * Get all Jobs with their company’s information
 * * response successfully
 */
export const getAllJobsWithTheirCompany = async (req, res, next) => {
  // * destructing data from req.headers
  const { _id } = req.authUser;

  // * Get all Jobs with their company’s information
  const jobs = await Job.find().populate([{ path: "companyId" }]);
  if (!jobs.length) return next(new Error("No Jobs found", { cause: 400 }));
  // * response successfully
  res.status(200).json({ message: "Successfully", jobs });
};

//================================== Get All Jobs For a Specific Company ==================================//
/**
 * * destructing data from req.headers and req.query
 * * check company name already exists
 * * find All Jobs For a Specific Company
 * * response successfully
 */
export const getAllJobsSpecificCompany = async (req, res, next) => {
  // * destructing data from req.headers and req.query
  const { _id } = req.authUser;
  const { companyName } = req.query;

  // * check company name already exists
  const company = await Company.findOne({ companyName });
  if (!company) return next(new Error("Company not found", { cause: 400 }));
  console.log(company.id);
  // * find All Jobs For a Specific Company
  const jobs = await Job.find({ companyId: company._id });
  if (!jobs.length)
    return next(
      new Error(`Job not found for this company ${companyName}`, { cause: 400 })
    );

  // * response successfully
  res.status(200).json({ message: "Success", jobs });
};

//====================== Get All Jobs That Match The Following Filters  =====================//
/**
 *
 */
export const getAllJobsMatchFilters = async (req, res, next) => {
  // * destructing data from req.body and req.headers
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;
  const { _id } = req.authUser;

  // * filter jobs
  const findJob = await Job.find({
    $or: [
      { workingTime },
      { jobLocation },
      { seniorityLevel },
      { jobTitle },
      { technicalSkills },
    ],
  });
  if (!findJob.length) return next(new Error("Job not found", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "Jobs found", findJob });
};

//================================== Apply to Job ==================================//
/**
 * * destructing data from req.body and req.headers
 * * check jobId already exists
 * * uploade file pdf
 * * generate Unique String for folder
 * * get secure_url and public_id and folderId
 * * add application and check is created
 * * response successful
 */
export const applyJob = async (req, res, next) => {
  // * destructing data from req.body and req.headers and req.file
  const { jobId, userTechSkills, userSoftSkills } = req.body;
  const { _id } = req.authUser;

  // * check jobId already exists
  const job = await Job.findById(jobId);
  if (!job) return next(new Error("Job not found", { cause: 400 }));

  // * uploade file pdf
  if (!req.file)
    return next(new Error("Please upload at least one file", { cause: 400 }));

  // * generate Unique String for folder
  const folderId = generateUniqueString(5);

  // * get secure_url and public_id and folderId
  const { secure_url, public_id } =
    await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: `/cvs/${job.companyId}/${_id}/${folderId}`,
    });
  const cv = [{ secure_url, public_id, folderId }];
  if (!cv) return next(new Error("cv not uploaded", { cause: 400 }));

  // * add application and check is created
  const application = await Application.create({
    jobId,
    userId: _id,
    userTechSkills,
    userSoftSkills,
    userResume: cv,
  });
  if (!application)
    return next(new Error("Application not created", { cause: 400 }));

  // * response successful
  res.status(200).json({ message: "Application created", application });
};
