import User from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import { response } from "express";
import jwt from "jsonwebtoken";
import generateOTP from "../../utils/generateOTP.js";

//================================== Sign Up =================================//
/**
 * * destructuring data from req.body
 * * create username from (firstName + lastName)
 * * check is email already existing
 * * check is mobile number already existing
 * * hash password by bcryptjs and check if not hashed
 * * create new user and check if not created
 * * response success
 */
export const signUp = async (req, res, next) => {
  // destructuring data from req.body
  const {
    firstName,
    lastName,
    email,
    recoveryEmail,
    password,
    dateOfBirth,
    mobileNumber,
    role,
    status,
  } = req.body;

  //create username from firstName and lastName
  const username = firstName + lastName;

  //check is email already existing
  const emailCheck = await User.findOne({ email });
  if (emailCheck)
    return next(
      new Error("email already exists, Please enter new email", { couse: 400 })
    );

  //check is mobile number already existing
  const mobileNumberCheck = await User.findOne({ mobileNumber });
  if (mobileNumberCheck)
    return next(
      new Error(
        "mobile number already exists, Please enter new mobile number",
        { couse: 400 }
      )
    );

  // * hash password by bcryptjs and check if not hashed
  const hashPassword = bcryptjs.hashSync(password, +process.env.salts_number);
  if (!hashPassword)
    return next(new Error("hash password failed", { cause: 400 }));

  //create new user and check if not createdz
  const user = await User.create({
    firstName,
    lastName,
    username,
    email,
    recoveryEmail,
    password: hashPassword,
    dateOfBirth,
    mobileNumber,
    role,
    status,
  });
  if (!user) return next(new Error("user not created", { couse: 400 }));

  //response success
  res.status(200).json({ message: "user created", user });
};

//================================== Sign In =================================//
/**
 * * destructuring data from req.body
 * * find user by email or mobile number
 * * check password matches if not
 * * create token and check is created or not
 * * update status from offline to online and check is updated or not
 * * response successfully
 */
export const signIn = async (req, res, next) => {
  // * destructuring data from req.body
  const { email, mobileNumber, password } = req.body;

  // * find user by email or mobile number
  const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * check password matches if not
  const checkPassword = bcryptjs.compareSync(password, user.password);
  if (!checkPassword)
    return next(new Error("Invalid password", { cause: 400 }));

  // * create token and check is created or not
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.private_key,
    { expiresIn: "1d" }
  );
  if (!token) return next(new Error("Invalid token", { cause: 400 }));

  // * update status from offline to online and check is updated or not
  const updateStatus = await User.findByIdAndUpdate(
    { _id: user.id },
    { status: "online" }
  );

  if (!updateStatus) return next(new Error("Invalid status", { cause: 400 }));
  // * response successfully
  res.status(200).json({ message: "signIn success", user, token });
};

//================================== update Account =========================//
/**
 *  * destructuring data from req.body and req.headers and req.query
 *  * check if email already exists
 *  * check if mobileNumber already exists
 *  * check firstName and lastName will change username
 *  * Check if the logged-in user is the owner of the account
 *  * update account check success or not
 *  * response success
 */
export const updateAccount = async (req, res, next) => {
  // * destructuring data from req.body and req.headers
  const { fName, lName, email, mobileNumber, recoveryEmail, dateOfBirth } =
    req.body;
  const { accountId } = req.query;
  const { _id } = req.authUser;
  let username = "";

  // * check if email already exists
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(
      new Error("email already exists, please enter new email", { cause: 400 })
    );
  }

  // * check if mobileNumber already exists
  const mobileNumberCheck = await User.findOne({ mobileNumber });
  if (mobileNumberCheck) {
    return next(
      new Error("mobileNumber already exists, please enter new mobileNumber", {
        cause: 400,
      })
    );
  }

  // * check firstName and lastName will change username
  const user = await User.findById(_id);
  if (fName && lName) {
    username = fName + lName;
  } else if (fName && !lName) {
    username = fName + user.lastName;
  } else if (!fName && lName) {
    username = user.firstName + lName;
  }

  // * Check if the logged-in user is the owner of the account
  if (_id != accountId)
    return next(new Error("You must be the owner of Account", { cause: 400 }));

  // * update account check success or not
  const updateUser = await User.updateOne(
    { _id },
    {
      firstName: fName,
      lastName: lName,
      username,
      email,
      mobileNumber,
      recoveryEmail,
      dateOfBirth,
    }
  );
  if (!updateUser) return next(new Error("updated Failed", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "updated", updateUser });
};

//================================== delete Account =========================//
/**
 *  * destructuring data from req.headers and req.query
 *  * Check if the logged-in user is the owner of the account
 *  * find and delete account and check is deleted
 *  * response success
 */
export const deleteAccount = async (req, res, next) => {
  // * destructuring data from req.headers and req.query
  const { _id } = req.authUser;
  const { accountId } = req.query;

  // * Check if the logged-in user is the owner of the account
  if (_id != accountId)
    return next(new Error("You must be the owner of Account", { cause: 400 }));

  // * find and delete account and check is deleted
  const accountDelete = await User.findByIdAndDelete(_id);
  if (!accountDelete)
    return next(new Error("delete account failed", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "Account deleted successfully" });
};

//================================ Get User Account Data =========================//
/**
 * * destructuring data from req.headers and req.query
 * * Check if the logged-in user is the owner of the account
 * * find user data by findById and check is already exists
 * * response success
 */
export const getUserAccountData = async (req, res, next) => {
  // * destructuring data from req.headers and req.query
  const { _id } = req.authUser;
  const { accountId } = req.query;

  // * Check if the logged-in user is the owner of the account
  if (_id != accountId)
    return next(new Error("You must be the owner of Account", { cause: 400 }));

  // * find user data by findById and check is already exists
  const user = await User.findById(_id);
  if (!user)
    return next(new Error("This account does not exist", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "user found", user });
};

//================================ Get Profile Data For Another User  =========================//
/**
 * * destructuring data from req.headers and req.query
 * * find user by findById method and check is exists
 * * response success
 */
export const getProfileDataForAnotherUser = async (req, res, next) => {
  // * destructuring data from req.query
  const { accountId } = req.query;

  // * find user by findById method and check is exists
  const user = await User.findById(accountId).select(
    "-_id -password -createdAt -updatedAt -__v"
  );
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "user found", user });
};

//================================== Update password   =========================//
/**
 * * destructuring data from req.headers and req.query
 * * find account and compare password
 * * hash new Password and check if hashed
 * * update Password and check if updated
 * * response success
 */
export const updatePassword = async (req, res, next) => {
  // * destructuring data from req.body and req.headers
  const { password, newPassword } = req.body;
  const { _id } = req.authUser;

  // * find account and compare password
  const user = await User.findById(_id);
  const passwordMatched = bcryptjs.compareSync(password, user.password);

  if (!passwordMatched) {
    return next(
      new Error("password mismatch, Please Enter correct password", {
        cause: 400,
      })
    );
  }

  // * hash new Password and check if hashed
  const hashNewPassword = bcryptjs.hashSync(
    newPassword,
    +process.env.salts_number
  );
  if (!hashNewPassword)
    return next(new Error("new password not hashed", { cause: 400 }));

  // * update Password and check if updated
  const changePassword = await User.findByIdAndUpdate(_id, {
    password: hashNewPassword,
  });
  if (!changePassword)
    return next(new Error("new password not updated", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "updated password", changePassword });
};

//=============================== Forget password =================================//
/**
 * * destructuring data from req.headers and req.query
 * * check user is already exists
 * * generate OTP and time to Expire OTP
 * * update OTP in User model and check if updated
 * * response successfully
 */
export const forgetPassword = async (req, res, next) => {
  // * destructuring data from req.body
  const { email } = req.body;

  // * check user is already exists
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * generate OTP and time to Expire OTP
  const otp = generateOTP();
  const otpExpiration = new Date();
  otpExpiration.setMinutes(otpExpiration.getMinutes() + 10);

  // * update OTP in User model
  user.passwordResetOTP = {
    code: otp,
    expiresAt: otpExpiration,
  };
  await user.save();

  // * response successfully
  res.status(200).json({ message: "User updated OTP" });
};

//=============================== Reset Password After OTP =================================//
/**
 * * destructuring data from req.body
 * * check user is already exists
 * * check OTP is exists and code OTP match and expired OTP
 * * hash password by bcryptjs and check if not hashed
 * * update password and check if not updated
 * * response successfully
 */
export const resetPasswordAfterOTP = async (req, res, next) => {
  // * destructuring data from req.body
  const { email, otp, newPassword } = req.body;

  // * check user is already exists
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * check OTP is exists and code OTP match and expired OTP
  const storedOTP = user.passwordResetOTP;
  if (!storedOTP || storedOTP.code !== otp || new Date() > storedOTP.expiresAt)
    return next(new Error("Invalid or expired OTP", { cause: 401 }));

  // * hash password by bcryptjs and check if not hashed
  const hashNewPassword = bcryptjs.hashSync(
    newPassword,
    +process.env.salts_number
  );
  if (!hashNewPassword)
    return next(new Error("hash password failed", { cause: 400 }));

  // * update password and check if not updated
  const updatePassword = await User.findByIdAndUpdate(
    { _id: user._id },
    { password: hashNewPassword }
  );
  if (!updatePassword)
    return next(new Error("password update failed", { cause: 400 }));

  // * response successful
  res.status(200).json({ message: "Password updated" });
};

//======================== Get All Accounts Associated Recovery Email =========================//
/**
 * * destructuring data from req.body
 * * get all accounts associated and check if they exist
 * * response success
 */
export const getAllAccountsAssociated = async (req, res, next) => {
  // * destructuring data from req.body
  const { recoveryEmail } = req.body;

  // * get all accounts associated and check if they exist
  const accounts = await User.find({ recoveryEmail });
  console.log({ accounts });
  if (!accounts.length)
    return next(new Error("Recovery email not found", { cause: 400 }));

  // * response success
  res.status(200).json({ message: "recovery email found", accounts });
};
