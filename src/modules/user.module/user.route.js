import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as uc from "./user.controller.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import {
  forgetPasswordSchema,
  getAllAccountsAssociatedSchema,
  resetPasswordAfterOTPSchema,
  signInSchema,
  signUpSchema,
  updatePasswordSchema,
  update_delete_getUserData_Schema,
} from "./user.validationSchema.js";
import { auth } from "../../middlewares/authmiddleware.js";
import { endPointsRoles } from "./user.endPoints.role.js";

const router = Router();

router.post(
  "/signup",
  validationMiddleWare(signUpSchema),
  expressAsyncHandler(uc.signUp)
);
router.post(
  "/signIn",
  validationMiddleWare(signInSchema),
  expressAsyncHandler(uc.signIn)
);

router.put(
  "/update",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(update_delete_getUserData_Schema),
  expressAsyncHandler(uc.updateAccount)
);

router.delete(
  "/delete",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(update_delete_getUserData_Schema),
  expressAsyncHandler(uc.deleteAccount)
);

router.get(
  "/getuserdata",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(update_delete_getUserData_Schema),
  expressAsyncHandler(uc.getUserAccountData)
);

router.get(
  "/getanotheuserdata",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(update_delete_getUserData_Schema),
  expressAsyncHandler(uc.getProfileDataForAnotherUser)
);

router.patch(
  "/updatepassword",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(updatePasswordSchema),
  expressAsyncHandler(uc.updatePassword)
);

router.get(
  "/forgetPassword",
  validationMiddleWare(forgetPasswordSchema),
  expressAsyncHandler(uc.forgetPassword)
);

router.patch(
  "/resetPasswordAfterOTP",
  validationMiddleWare(resetPasswordAfterOTPSchema),
  expressAsyncHandler(uc.resetPasswordAfterOTP)
);
router.get(
  "/getAllAccountsAssociated",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllAccountsAssociatedSchema),
  expressAsyncHandler(uc.getAllAccountsAssociated)
);

export default router;
