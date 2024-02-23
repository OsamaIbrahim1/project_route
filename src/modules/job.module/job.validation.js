import Joi from "joi";
import { Types } from "mongoose";
import { generalRules } from "../../utils/general.validation.rule.js";

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
  }),
  headers: generalRules.headersRules,
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
  }),
  query: Joi.object({
    jobId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const deleteJobSchema = {
  query: Joi.object({
    jobId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const getAllJobsWithTheirCompanySchema = {
  headers: generalRules.headersRules,
};

export const getAllJobsSpecificCompanySchema = {
  query: Joi.object({
    companyName: Joi.string().required(),
  }),
  headers: generalRules.headersRules,
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
    jobId: generalRules.dbId,
    userId: generalRules.dbId,
    userTechSkills: Joi.array().required(),
    userSoftSkills: Joi.array().required(),
  }),
};
