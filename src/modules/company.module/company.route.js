import { Router } from "express";
import { endPointsRoles } from "./company.endPoints.role.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import * as cc from "./company.controller.js";
import { auth } from "../../middlewares/authmiddleware.js";
import {
  addCompanySchema,
  deleteCompanySchema,
  getAllApplicationsSpecificJobsSchema,
  getCompanyByNameSchema,
  getCompanyDataSchema,
  updatedCompanySchema,
} from "./company.validation.js";
const router = Router();

router.post(
  "/addcompany",
  auth(endPointsRoles.HR),
  validationMiddleWare(addCompanySchema),
  expressAsyncHandler(cc.addCompany)
);

router.put(
  "/updateCompany",
  auth(endPointsRoles.HR),
  validationMiddleWare(updatedCompanySchema),
  expressAsyncHandler(cc.updateCompany)
);

router.delete(
  "/deletecompany",
  auth(endPointsRoles.HR),
  validationMiddleWare(deleteCompanySchema),
  expressAsyncHandler(cc.deleteCompany)
);

router.get(
  "/getCompanyData",
  auth(endPointsRoles.HR),
  validationMiddleWare(getCompanyDataSchema),
  expressAsyncHandler(cc.getCompanyData)
);

router.get(
  "/getCompanyByName",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getCompanyByNameSchema),
  expressAsyncHandler(cc.getCompanyByName)
);

router.get(
  "/getAllApplicationsSpecificJobs",
  auth(endPointsRoles.HR),
  validationMiddleWare(getAllApplicationsSpecificJobsSchema),
  expressAsyncHandler(cc.getAllApplicationsSpecificJobs)
);
export default router;
