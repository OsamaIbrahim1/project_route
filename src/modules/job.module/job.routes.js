import { Router } from "express";
import { endPointsRoles } from "./job.endPoints.role.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import * as jobController from "./job.controller.js";
import { auth } from "../../middlewares/authmiddleware.js";
import {
  addJobSchema,
  updatedJobSchema,
  deleteJobSchema,
  getAllJobsWithTheirCompanySchema,
  getAllJobsMatchFiltersSchema,
  applyJobSchema,
  getAllJobsSpecificCompanySchema,
} from "./job.validation.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();

router.post(
  "/addjob",
  auth(endPointsRoles.HR),
  validationMiddleWare(addJobSchema),
  expressAsyncHandler(jobController.addJob)
);

router.put(
  "/updatejob",
  auth(endPointsRoles.HR),
  validationMiddleWare(updatedJobSchema),
  expressAsyncHandler(jobController.updateJob)
);

router.delete(
  "/deletejob",
  auth(endPointsRoles.HR),
  validationMiddleWare(deleteJobSchema),
  expressAsyncHandler(jobController.deleteJob)
);

router.get(
  "/getAllJobsWithTheirCompany",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsWithTheirCompanySchema),
  expressAsyncHandler(jobController.getAllJobsWithTheirCompany)
);

router.get(
  "/getAllJobsSpecificCompany",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsSpecificCompanySchema),
  expressAsyncHandler(jobController.getAllJobsSpecificCompany)
);

router.get(
  "/getAllJobsMatchFilters",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsMatchFiltersSchema),
  expressAsyncHandler(jobController.getAllJobsMatchFilters)
);

router.post(
  "/applyJob",
  auth(endPointsRoles.user),
  multerMiddleHost({
    extensions: allowedExtensions.document,
  }).single("cv"),
  validationMiddleWare(applyJobSchema),
  expressAsyncHandler(jobController.applyJob)
);

export default router;
