import Joi from "joi";
import { Types } from "mongoose";
import { generalRules } from "../../utils/general.validation.rule.js";

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
    numberOfEmployees: Joi.object({
      from: Joi.number().required(),
      to: Joi.number()
        .required()
        .greater(Joi.ref("from"))
        .message('"to" must be greater than "from"'),
    }),
    companyEmail: Joi.string().required(),
  }),
  headers: generalRules.headersRules,
};

export const updatedCompanySchema = {
  body: Joi.object({
    companyName: Joi.string(),
    description: Joi.string().min(20),
    industry: Joi.string(),
    address: Joi.string(),
    numberOfEmployess: Joi.object({
      from: Joi.number().greater(10),
      to: Joi.number()
        .less(21)
        .greater(Joi.ref("from"))
        .message('"to" must be greater than "from"'),
    }),
    companyEmail: Joi.string().email(),
  }),
  query: Joi.object({
    companyId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const deleteCompanySchema = {
  query: Joi.object({
    companyId: generalRules.dbId,
  }),
  headers: generalRules.headersRules,
};

export const getCompanyDataSchema = {
  query: Joi.object({
    companyId: generalRules.dbId,
  }),
};

export const getCompanyByNameSchema = {
  body: Joi.object({
    companyName: Joi.string().required(),
  }),
  headers: generalRules.headersRules,
};

export const getAllApplicationsSpecificJobsSchema = {
  headers: generalRules.headersRules,
};
