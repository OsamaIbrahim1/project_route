import { application } from "express";
import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import User from "../../../DB/models/user.model.js";

//================================== Add Company ==================================//
/**
 * * destructing data from req.body and req.headers
 * * create company document and check if created
 * * response success
 */
export const addCompany = async (req, res, next) => {
  // * destructing data from req.body and req.headers
  const {
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR,
  } = req.body;
  const { _id } = req.authUser;

  // * create company document and check if created
  const company = await Company.create({
    companyName,
    description,
    industry,
    address,
    numberOfEmployees,
    companyEmail,
    companyHR,
  });
  if (!company) return next(new Error("company not created", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "company created", company });
};

//================================== Update Company ==================================//
/**
 * * destructing data from req.body and req.headers and req.query
 * * check if companyId already exists
 * * check if companyHR === _id <= user logged in
 * * update company and check if company updated successfully
 * * response successfully
 */
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
  if (!_id.equals(company.companyHR))
    return next(new Error("cant update company", { cause: 400 }));

  // * check companyEmail already exists or not
  const checkCompanyEmail = await Company.findOne({ companyEmail });
  if (checkCompanyEmail)
    return next(new Error("company Email is already Exists", { cause: 400 }));

  // * update company and check if company updated successfully
  const companyUpdated = await Company.findByIdAndUpdate(
    { _id: companyId },
    {
      companyName,
      description,
      industry,
      address,
      numberOfEmployess,
      companyEmail,
    }
  );
  if (!companyUpdated)
    return next(new Error("company not updated", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "updated company", companyUpdated });
};

//================================== Delete Company ==================================//
/**
 * * destructing data from req.headers and req.query
 * * find the company and check if the User is Owner
 * * delete company and check is deleted
 * * response successfully
 */
export const deleteCompany = async (req, res, next) => {
  // * destructing data from req.headers and req.query
  const { _id } = req.authUser;
  const { companyId } = req.query;

  // * find the company and check if the User is Owner
  const company = await Company.findById({ _id: companyId });
  if (!_id.equals(company.companyHR))
    return next(new Error("You cannot delete a company", { cause: 400 }));

  // * delete company and check is deleted
  const companyDeleted = await Company.findByIdAndDelete({ _id: companyId });
  if (!companyDeleted) return next(new Error("deleted faild", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "deleted success", companyDeleted });
};

//================================== Get Company Data  ==================================//
/**
 * * destructing data from req.query
 * * get company data and check is already exists
 * * all jobs related to this company and check are already exists
 * * response successfully
 */
export const getCompanyData = async (req, res, next) => {
  // * destructing data from req.query
  const { companyId } = req.query;

  // * get company data and check is already exists
  const company = await Company.findById(companyId);
  if (!company) return next(new Error("Company not found", { cause: 400 }));

  // * all jobs related to this company and check are already exists
  const jobs = await Job.find({ companyId });
  if (!jobs.length) return next(new Error("Job not found", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "found company and jobs", company, jobs });
};

//================================== Get Company By Name  ==================================//
/**
 * * destructing data from req.body
 * * get company by  name and check if it exists
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
export const getAllApplicationsSpecificJobs = async (req, res, next) => {
  // * destructing data from req.headers
  const { _id } = req.authUser;

  // * get company to know all his Jobs
  const company = await Company.findOne({ companyHR: _id });
  if (!company) return next(new Error("company not found", { cause: 400 }));

  // * get jobs from company
  const jobs = await Job.find({ companyId: company._id });
  if (!jobs.length) return next(new Error("jobs not found", { cause: 400 }));

  // * get all applications for specific job
  let applicationsJobs = [];
  for (const iterator of jobs) {
    const applications = await Application.find({ jobId: iterator._id });
    applicationsJobs.push(applications);
  }
  if (!applicationsJobs.length)
    return next(new Error("Applications not found", { cause: 400 }));

  // * response successfully
  res.status(200).json({ message: "application found", applicationsJobs });
};
