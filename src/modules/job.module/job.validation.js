import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value);
  return isValid ? value : helper.message("Invalid ObjectId");
};

export const addJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().min(10).max(50).required(),
    jobLocation: Joi.string()
      .valid("onsite", "remotely", "hybrid")
      .default("remotely")
      .required(),
    workingTime: Joi.string()
      .valid("part-time", "full-time")
      .default("part-time")
      .required(),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .default("Junior")
      .required(),
    jobDescription: Joi.string().min(20).required(),
    technicalSkills: Joi.array().required(),
    softSkills: Joi.array().required(),
    addedBy: Joi.string().custom(objectIdValidation).required(),
    companyId: Joi.string().custom(objectIdValidation).required(),
  }),
};

export const updatedJobSchema = {
  body: Joi.object({
    jobTitle: Joi.string().min(10).max(50),
    jobLocation: Joi.string()
      .valid("onsite", "remotely", "hybrid")
      .default("remotely"),
    workingTime: Joi.string()
      .valid("part-time", "full-time")
      .default("part-time"),
    seniorityLevel: Joi.string()
      .valid("Junior", "Mid-Level", "Senior", "Team-Lead", "CTO")
      .default("Junior"),
    jobDescription: Joi.string().min(20),
    technicalSkills: Joi.array(),
    softSkills: Joi.array(),
    companyId: Joi.string().custom(objectIdValidation),
  }),
  query: Joi.object({
    jobId: Joi.string().custom(objectIdValidation).required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    "postman-token": Joi.string(),
    "cache-control": Joi.string(),
    host: Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
  }),
};

export const deleteJobSchema = {
  query: Joi.object({
    jobId: Joi.string().custom(objectIdValidation).required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    "postman-token": Joi.string(),
    "cache-control": Joi.string(),
    host: Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
  }),
};

export const getAllJobsWithTheirCompanySchema = {
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    "postman-token": Joi.string(),
    "cache-control": Joi.string(),
    host: Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
  }),
};

export const getAllJobsSpecificCompanySchema = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    "postman-token": Joi.string(),
    "cache-control": Joi.string(),
    host: Joi.string(),
    "content-type": Joi.string(),
    "content-length": Joi.string(),
    "user-agent": Joi.string(),
    accept: Joi.string(),
    "accept-encoding": Joi.string(),
    connection: Joi.string(),
  }),
};

export const getAllJobsMatchFiltersSchema = {
  body: Joi.object({
    jobTitle: Joi.string().min(10).max(50),
    workingTime: Joi.string(),
    jobLocation: Joi.string(),
    seniorityLevel: Joi.string(),
    technicalSkills: Joi.array(),
  }),
};

export const applyJobSchema = {
  body: Joi.object({
    jobId: Joi.string().custom(objectIdValidation).required(),
    userId: Joi.string().custom(objectIdValidation),
    userTechSkills: Joi.array().required(),
    userSoftSkills: Joi.array().required(),
  }),
};
