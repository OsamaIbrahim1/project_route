import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as userController from "./user.controller.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  deleteSchema,
  forgetPasswordSchema,
  getAllAccountsAssociatedSchema,
  getProfileDataForAnotherUserSchema,
  getUserAccountDataSchema,
  resetPasswordAfterOTPSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  updateSchema,
} from "./user.validationSchema.js";
import { auth } from "../../middlewares/authmiddleware.js";
import { endPointsRoles } from "./user.endPoints.role.js";

const router = Router();

router.post( 
  "/signup",
  validationMiddleWare(signUpSchema),
  expressAsyncHandler(userController.signUp)
);

router.post(
  "/signIn",
  validationMiddleWare(signInSchema),
  expressAsyncHandler(userController.signIn)
);

router.put(
  "/update",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(updateSchema),
  expressAsyncHandler(userController.updateAccount)
);

router.delete(
  "/delete",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(deleteSchema),
  expressAsyncHandler(userController.deleteAccount)
);

router.get(
  "/getuserdata",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getUserAccountDataSchema),
  expressAsyncHandler(userController.getUserAccountData)
);

router.get(
  "/getanotheuserdata",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getProfileDataForAnotherUserSchema),
  expressAsyncHandler(userController.getProfileDataForAnotherUser)
);

router.patch(
  "/updatepassword",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(updatePasswordSchema),
  expressAsyncHandler(userController.updatePassword)
);

router.get(
  "/forgetPassword",
  validationMiddleWare(forgetPasswordSchema),
  expressAsyncHandler(userController.forgetPassword)
);

router.patch(
  "/resetPasswordAfterOTP",
  validationMiddleWare(resetPasswordAfterOTPSchema),
  expressAsyncHandler(userController.resetPasswordAfterOTP)
);

router.get(
  "/getAllAccountsAssociated",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllAccountsAssociatedSchema),
  expressAsyncHandler(userController.getAllAccountsAssociated)
);

export default router;
