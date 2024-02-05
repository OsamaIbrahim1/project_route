import Joi from "joi";
import { Types } from "mongoose";

export const signUpSchema = {
  body: Joi.object({
    firstName: Joi.string().min(3).max(15).required(),
    lastName: Joi.string().min(3).max(15).required(),
    username: Joi.string().min(6).max(30),
    email: Joi.string().email().required(),
    recoveryEmail: Joi.string().email().required(),
    password: Joi.string().min(6).max(15).required(),
    dateOfBirth: Joi.date().iso().required(),
    mobileNumber: Joi.string().required(),
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
    mobileNumber: Joi.string(),
  }),
};

// * validation for ObjectId
const objectIdValidation = (value, helper) => {
  const isValid = Types.ObjectId.isValid(value);
  return isValid ? value : helper.message("Invalid ObjectId");
};

export const update_delete_getUserData_Schema = {
  body: Joi.object({
    fName: Joi.string().min(3).max(15),
    lName: Joi.string().min(3).max(15),
    username: Joi.string().min(6).max(30),
    email: Joi.string().email(),
    recoveryEmail: Joi.string().email(),
    dateOfBirth: Joi.date().iso(),
    mobileNumber: Joi.string(),
  }),
  query: Joi.object({
    accountId: Joi.string().custom(objectIdValidation).required(),
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

export const updatePasswordSchema = {
  body: Joi.object({
    password: Joi.string().min(6).max(15).required(),
    newPassword: Joi.string().min(6).max(15).required(),
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
