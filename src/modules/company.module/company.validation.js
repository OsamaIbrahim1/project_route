import Joi from "joi";
import { Types } from "mongoose";

const objectIdValidation = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value);
  return isValid ? value : helper.message("Invalid ObjectId");
};
export const addCompanySchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
    description: Joi.string().min(20).required(),
    industry: Joi.string().required(),
    address: Joi.string().required(),
    numberOfEmployees: Joi.number().min(11).max(20).required(),
    companyEmail: Joi.string().required(),
    companyHR: Joi.string().custom(objectIdValidation).required(),
  }),
};

export const updatedCompanySchema = {
  body: Joi.object({
    companyName: Joi.string(),
    description: Joi.string().min(20),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployess: Joi.number().min(11).max(20),
    companyEmail: Joi.string(),
  }),
  query: Joi.object({
    companyId: Joi.string().custom(objectIdValidation).required(),
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

export const deleteCompanySchema = {
  query: Joi.object({
    companyId: Joi.string().custom(objectIdValidation).required(),
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

export const getCompanyDataSchema = {
  query: Joi.object({
    companyId: Joi.string().custom(objectIdValidation).required(),
  }),
};

export const getCompanyByNameSchema = {
  body: Joi.object({
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

export const getAllApplicationsSpecificJobsSchema = {
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
