import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";

//================================== Add Company ==================================//
/**
 * * destructing data from req.body and req.headers
 * * check if companyName and  companyEmail not exists before
 * * create company document and check if created
 * * response success
 */
// ? changes
export const addCompany = async (req, res, next) => {
  // * destructing data from req.body and req.headers
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
  } = req.body;
  const { _id } = req.authUser;

  // ? change
  // * check if companyName and  companyEmail not exists before
  const checkCompanyName = await Company.findOne({ companyName });
  if (checkCompanyName) {
    return next(new Error(`Company name is already exists`, { cause: 400 }));
  }
  const checkCompanyEmail = await Company.findOne({ companyEmail });
  if (checkCompanyEmail) {
    return next(new Error(`Company Email is already exists`, { cause: 400 }));
  }

  // * create company document and check if created
  const company = await Company.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR: _id,
  });
  if (!company) return next(new Error("company not created", { cause: 400 }));

  // * response success
  res
    .status(201)
    .json({ success: true, message: "company created", data: company });
};

//================================== Update Company ==================================//
/**
 * * destructing data from req.body and req.headers and req.query
 * * check if companyId already exists
 * * check if companyHR === _id <= user logged in
 * * if user update company name
 * * check if companyName is old company name
 * * if user update companyEmail
 * * check companyEmail and companyName already exists or not
 * * update description and address and industry and number of companies
 * * save chenges
 * * response successfully
 */
// ? changes
export const updateCompany = async (req, res, next) => {
  // * destructing data from req.body and req.headers and req.query
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployess,
    companyEmail,
  } = req.body;
  const { _id } = req.authUser;
  const { companyId } = req.query;

  // * check if companyId already exists
  const company = await Company.findById({ _id: companyId });
  if (!company) return next(new Error("company not found", { cause: 400 }));

  // * check if companyHR === _id <= user logged in
  if (company.companyHR.toString() !== _id.toString())
    return next(new Error("cant update company", { cause: 400 }));

  // * if user update company name
  if (companyName) {
    // * check if companyName is old company name
    if (company.companyName === companyName) {
      return next(
        new Error("company name is old company name", { cause: 400 })
      );
    }
    const checkCompanyName = await Company.findOne({ companyName });
    if (checkCompanyName) {
      return next(new Error("company name is already Exists", { cause: 400 }));
    }
    company.companyName = companyName;
  }

  // * if user update companyEmail
  if (companyEmail) {
    // * check companyEmail and companyName already exists or not
    if (company.companyEmail.toString() === companyEmail) {
      return next(
        new Error("company Email is old company Email", { cause: 400 })
      );
    }
    const checkCompanyEmail = await Company.findOne({ companyEmail });
    if (checkCompanyEmail) {
      return next(new Error("company Email is already Exists", { cause: 400 }));
    }
    company.companyEmail = companyEmail;
  }

  // * update description and address and industry and number of companies
  if (description) company.description = description;
  if (address) company.address = address;
  if (industry) company.industry = industry;
  if (numberOfEmployess) company.numberOfEmployees = numberOfEmployess;

  // * save chenges
  await company.save();

  // * response successfully
  res
    .status(200)
    .json({ success: true, message: "updated company", data: company });
};

//================================== Delete Company ==================================//
/**
 * * destructing data from req.headers and req.query
 * * find the company and check if the User is Owner
 * * delete company and check is deleted
 * * delete Jobs and applications
 * * response successfully
 */
// ? changes
export const deleteCompany = async (req, res, next) => {
  // * destructing data from req.headers and req.query
  const { _id } = req.authUser;
  const { companyId } = req.query;

  // ? change
  // * find the company and check if the User is Owner
  const company = await Company.findById({ _id: companyId });
  if (_id.toString() !== company.companyHR.toString())
    return next(new Error("You cannot delete a company", { cause: 400 }));

  // * delete company and check is deleted
  const companyDeleted = await Company.findByIdAndDelete({ _id: companyId });
  if (!companyDeleted) return next(new Error("deleted faild", { cause: 400 }));
  //  ? change
  // * delete Jobs and applications
  await Job.deleteMany({ companyId });
  await Application.deleteMany({ companyId });

  // * response successfully
  res.status(200).json({ message: "deleted success", companyDeleted });
};

//================================== Get Company Data  ==================================//
/**
 * * destructing data from req.query and req.authUser
 * * get company data and check is already exists
 * * all jobs related to this company and check are already exists
 * * response successfully
 */
// ? changes
export const getCompanyData = async (req, res, next) => {
  // * destructing data from req.query and req.authUser
  const { companyId } = req.query;
  const { _id } = req.authUser;

  // * get company data and check is already exists
  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * all jobs related to this company and check are already exists
  const jobs = await Job.find({ addedBy: _id });
  if (!jobs.length) return next(new Error("Job not found", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "found company and jobs", company, jobs });
};

//================================== Get Company By Name  ==================================//
/**
 * * destructing data from req.body
 * * get company by name and check if it exists
 * * response successfully
 */
export const getCompanyByName = async (req, res, next) => {
  // * destructing data from req.body
  const { companyName } = req.body;

  // * get company by  name and check if it exists
  const company = await Company.findOne({ companyName });
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "found company", company });
};

//====================== Get All Applications For Specific Jobs  ====================//
/**
 * * destructing data from req.headers
 * * get company to know all his Jobs
 * * get jobs from company
 * * get all applications for specific job
 * * response successfully
 */
// ! 15 - getAllApplicationsSpecificJobs :  you use companyId to find job ,
// ! i want another logic  (see number 2 ) (-1.5)
// ? changes
export const getAllApplicationsSpecificJobs = async (req, res, next) => {
  // * destructing data from req.headers
  const { _id } = req.authUser;

  // * get job by _id
  const jobs = await Job.find({ addedBy: _id });
  if (!jobs.length) return next(new Error("Jobs not found", { cause: 404 }));

  let allApplications = [];
  // * get all Applications for all jobs
  for (const key of jobs) {
    console.log(key._id);
    const applications = await Application.find({ jobId: key._id });
    applications.unshift(key);
    allApplications.push(applications);
  }

  // * response successfully
  res
    .status(200)
    .json({
      success: true,
      message: "application found",
      data: allApplications,
    });
};
