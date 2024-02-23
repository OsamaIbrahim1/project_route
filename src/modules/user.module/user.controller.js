import User from "../../../DB/models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import generateOTP from "../../utils/generateOTP.js";
import Application from "../../../DB/models/application.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";

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
  // * destructuring data from req.body
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

  // * create username from firstName and lastName
  const username = firstName + lastName;

  // * check is email already existing
  const emailCheck = await User.findOne({ email });
  if (emailCheck)
    return next(
      new Error("email already exists, Please enter new email", { couse: 400 })
    );

  // * check is mobile number already existing
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

  // * create new user and check if not created
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

  // * response success
  res.status(200).json({ message: "user created", user });
};

//================================== Sign In =================================//
/**
 * * destructuring data from req.body
 * * find user by email or mobile number
 * * check password matches if not
 * * create token and check is created or not
 * * update status from offline to online
 * * response successfully
 */
// ? change
export const signIn = async (req, res, next) => {
  // * destructuring data from req.body
  const { email, mobileNumber, password } = req.body;

  // * find user by email or mobile number
  const user = await User.findOne({ $or: [{ email }, { mobileNumber }] });
  if (!user) return next(new Error("User not found", { cause: 404 }));

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

  // * update status from offline to online by save method
  user.status = "online";

  await user.save();

  // * response successfully
  res.status(200).json({ message: "signIn success", user, token });
};

//================================== update Account =========================//
/**
 * * destructuring data from req.body and req.headers
 *  * check if email already exists
 *  * check if mobileNumber already exists
 *  * check firstName and lastName will change username
 *  * update account by save method
 *  * response success
 */
export const updateAccount = async (req, res, next) => {
  // * destructuring data from req.body and req.headers
  const {
    firstName,
    lastName,
    email,
    mobileNumber,
    recoveryEmail,
    dateOfBirth,
  } = req.body;
  const { _id } = req.authUser;

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
  if (firstName && lastName) {
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = firstName + lastName;
  } else if (firstName && !lastName) {
    user.firstName = firstName;
    user.username = firstName + user.lastName;
  } else if (!firstName && lastName) {
    user.lastName = lastName;
    user.username = user.firstName + lastName;
  }

  // * update account by save method
  if (email) {
    user.email = email;
  }
  if (mobileNumber) {
    user.mobileNumber = mobileNumber;
  }
  if (recoveryEmail) {
    user.recoveryEmail = recoveryEmail;
  }
  if (dateOfBirth) {
    user.dateOfBirth = dateOfBirth;
  }
  await user.save();

  // * response success
  res.status(200).json({ success: true, message: "updated", user });
};

//================================== delete Account =========================//
/**
 *  * destructuring data from req.headers and req.query
 *  * find and delete account and check is deleted
 *  * delete applications for this account
 *  * response success
 */
// ? changes
export const deleteAccount = async (req, res, next) => {
  // * destructuring data from req.headers and req.query
  const { _id } = req.authUser;

  // * find and delete account and check is deleted
  const accountDelete = await User.findByIdAndDelete(_id);
  if (!accountDelete)
    return next(new Error("delete account failed", { cause: 400 }));

  // * delete applications for this account
  const delteApps = await Application.deleteMany({ userId: _id });
  if (!delteApps) {
    return next(new Error("applications not deleted", { cause: 400 }));
  }

  // * response success
  res
    .status(200)
    .json({ success: true, message: "Account deleted successfully" });
};

//================================ Get User Account Data =========================//
/**
 * * destructuring data from req.headers and req.query
 * * find user data by findById and check is already exists
 * * response success
 */
// ? chenge 1
export const getUserAccountData = async (req, res, next) => {
  // * destructuring data from req.headers and req.query
  const { _id } = req.authUser;

  // * find user data by findById and check is already exists
  const user = await User.findById(_id, "-_id -password");
  if (!user)
    return next(new Error("This account does not exist", { cause: 404 }));

  // * response success
  res.status(200).json({ success: true, message: "user found", user });
};

//================================ Get Profile Data For Another User  =========================//
/**
 * * destructuring data from req.query
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
 * * destructuring data from req.headers and req.body
 * * find account and compare password
 * * hash new Password and check if hashed
 * * update Password and check if updated
 * * response success
 */
// ? change
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
  user.password = hashNewPassword;
  user.save();

  // * response success
  res.status(200).json({ message: "updated password", user });
};

//=============================== Forget password =================================//
/**
 * * destructuring data from req.query
 * * check user is already exists
 * * generate OTP and time to Expire OTP
 * * update OTP in User model
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
  res.status(200).json({ success: true, message: "User updated OTP", otp });
};

//=============================== Reset Password After OTP =================================//
/**
 * * destructuring data from req.body
 * * check user is already exists
 * * check OTP is match code OTP and expired OTP
 * * hash password by bcryptjs and check if not hashed
 * * update password by save method
 * * response successfully
 */

export const resetPasswordAfterOTP = async (req, res, next) => {
  // * destructuring data from req.body
  const { email, otp, newPassword } = req.body;

  // * check user is already exists
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User not found", { cause: 400 }));

  // * check OTP is match code OTP and expired OTP
  const storedOTP = user.passwordResetOTP;
  if (storedOTP.code !== otp || new Date() > storedOTP.expiresAt)
    return next(new Error("Invalid or expired OTP", { cause: 401 }));

  // * hash password by bcryptjs and check if not hashed
  const hashNewPassword = bcryptjs.hashSync(
    newPassword,
    +process.env.salts_number
  );

  if (!hashNewPassword)
    return next(new Error("hash password failed", { cause: 400 }));

  // * update password by save method
  user.password = hashNewPassword;
  await user.save();

  // * response successful
  res
    .status(200)
    .json({ success: true, message: "Password updated", data: user });
};

//======================== Get All Accounts Associated Recovery Email =========================//
/**
 * * destructuring data from req.body
 * * get all accounts associated and check if they exist
 * * response success
 */
// ? change
export const getAllAccountsAssociated = async (req, res, next) => {
  // * destructuring data from req.body
  const { recoveryEmail } = req.body;

  // * get all accounts associated and check if they exist
  const accounts = await User.find({ recoveryEmail });
  if (!accounts.length)
    return next(new Error("Recovery email not found", { cause: 400 }));

  // * response success
  res
    .status(200)
    .json({ success: true, message: "recovery email found", accounts });
};
