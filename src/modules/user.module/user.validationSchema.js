import Joi from "joi";
import { generalRules } from "../../utils/general.validation.rule.js";

// ! 10 - validation on mobileNumber : search how to make validation with regular expression
// ? change 1
export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    username: Joi.string().min(6).max(30),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    dateOfBirth: Joi.date().iso().required(),
    //  ? change
    // mobileNumber: Joi.string().required(),
    mobileNumber: Joi.string().required().pattern(new RegExp("^[0-9]{11}$")),
    role: Joi.string().valid("user", "hr").default("user").required(),
    status: Joi.string()
      .valid("online", "offline")
      .default("offline")
      .required(),
  }),
};

export const signInSchema = {
  body: Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6).max(15).required(),
    mobileNumber: Joi.string().pattern(new RegExp("^[0-9]{11}$")),
  }),
};

export const updateSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15),
    lastName: Joi.string().min(3).max(15),
    username: Joi.string().min(6).max(30),
    email: Joi.string().email(),
    recoveryEmail: Joi.string().email(),
    dateOfBirth: Joi.date().iso(),
    mobileNumber: Joi.string().pattern(new RegExp("^[0-9]{11}$")),
  }),
  headers: generalRules.headersRules,
};

export const deleteSchema = {
  headers: generalRules.headersRules,
};

export const getUserAccountDataSchema = {
  headers: generalRules.headersRules,
};
export const getProfileDataForAnotherUserSchema = {
  query: Joi.object({
    accountId: generalRules.dbId,
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    password: Joi.string().min(6).max(15).required(),
    newPassword: Joi.string().min(6).max(15).required(),
  }),
  headers: generalRules.headersRules,
};

export const forgetPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const resetPasswordAfterOTPSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    newPassword: Joi.string().min(6).max(15).required(),
  }),
};

export const getAllAccountsAssociatedSchema = {
  body: Joi.object({
    recoveryEmail: Joi.string().email().required(),
  }),
  headers: generalRules.headersRules, 
};
