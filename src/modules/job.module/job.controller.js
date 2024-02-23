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
// ? changes
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
  } = req.body;
  const { _id } = req.authUser;

  // * create new Job and check is created
  const job = await Job.create({
    jobTitle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: _id,
  });
  if (!job) return next(new Error("Job not created", { cause: 400 }));

  // * response successfully
  res
    .status(201)
    .json({ success: true, message: "Job created successfully", data: job });
};

//================================== Update Job ==================================//
/**
 * * destructing data from req.body and req.headers and req.query
 * * check if companyId already exists
 * * check if you want to update jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills
 * * save all updates
 * * response successfully
 */
// ? chenges
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
  } = req.body;
  const { jobId } = req.query;

  // * check if jobId already exists
  const job = await Job.findById({ _id: jobId });
  if (!job) return next(new Error("job not found", { cause: 400 }));

  // * check if you want to update jobTitle jobLocation workingTime seniorityLevel jobDescription technicalSkills softSkills
  if (jobTitle) job.jobTitle = jobTitle;
  if (jobLocation) job.jobLocation = jobLocation;
  if (workingTime) job.workingTime = workingTime;
  if (seniorityLevel) job.seniorityLevel = seniorityLevel;
  if (jobDescription) job.jobDescription = jobDescription;
  if (technicalSkills) job.technicalSkills = technicalSkills;
  if (softSkills) job.softSkills = softSkills;

  // * save all updates
  await job.save();

  // * response successfully
  res.status(200).json({ success: true, message: "updated Job", job });
};

//================================== Delete Company ==================================//
/**
 * * destructing data from req.headers and req.query
 * * find the job and check if the User is Owner
 * * delete job and check is deleted
 * * delete application for this job
 * * response successfully
 */
// ? chenges
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

  // ? chenge
  // * delete application for this job
  await Application.deleteMany({ jobId });

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "deleted success", jobDeleted });
};

//================================== Get All Jobs With Their Company ==================================//
/**
 * * all companies with their jobs
 * * response successfully
 */
// ! 19 - getAllJobsWithTheirCompany :  you use companyId to find job ,
// ! i want another logic  (see number 2 )   (-1.5) =>? method populate
// ? changes
export const getAllJobsWithTheirCompany = async (req, res, next) => {
  // * all companies with their jobs
  let allCompaiesWithJobs = [];
  const companies = await Company.find();
  for (const key of companies) {
    const jobs = await Job.find({ addedBy: key.companyHR });
    jobs.unshift(key);
    allCompaiesWithJobs.push(jobs);
  }

  // * response successfully
  res.status(200).json({
    success: true,
    message: "get data Successfully",
    allCompaiesWithJobs,
  });
};

//================================== Get All Jobs For a Specific Company ==================================//
/**
 * * destructing data from req.query
 * * check company name already exists
 * * find All Jobs For a Specific Company by companyHR
 * * response successfully
 */
// ! 20 - getAllJobsSpecificCompany :  you use companyId to find job ,
// ! i want another logic  (see number 2 ) (-1.5)
// ? changes
export const getAllJobsSpecificCompany = async (req, res, next) => {
  // * destructing data from req.query
  const { companyName } = req.query;

  // * check company name already exists
  const company = await Company.findOne({ companyName });
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * find All Jobs For a Specific Company by companyHR
  const jobs = await Job.find({ addedBy: company.companyHR });
  if (!jobs.length)
    return next(
      new Error(`Job not found for this company ${companyName}`, { cause: 400 })
    );

  // * response successfully
  res.status(200).json({ success: true, message: "Success", data: jobs });
};

//====================== Get All Jobs That Match The Following Filters  =====================//
/**
 * * destructing data from req.body
 * * filter jobs
 * * response successfully
 */
// ? change
export const getAllJobsMatchFilters = async (req, res, next) => {
  // * destructing data from req.body
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.body;

  // * filter jobs
  const findJob = await Job.find({
    $and: [
      { workingTime },
      { jobLocation },
      { seniorityLevel },
      { jobTitle },
      { technicalSkills },
    ],
  });
  if (!findJob.length) {
    return next(new Error("Job not found", { cause: 400 }));
  }

  // * response successfully
  res.status(200).json({ success: true, message: "Jobs found", data: findJob });
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
// ! 22 - applyJob : when application fail delete resume from cloudinary (-2)
// ? change
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
      folder: `cvs/${jobId}/${_id}/${folderId}`,
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
  if (!application) {
    await cloudinaryConnection().uploader.destroy(public_id);
    await cloudinaryConnection().api.delete_folder(
      `cvs/${jobId}/${_id}/${folderId}`
    );
    return next(new Error("Application not created", { cause: 400 }));
  }

  // * response successful
  res
    .status(201)
    .json({ success: true, message: "Application created", data: application });
};
