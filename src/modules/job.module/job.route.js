import { Router } from "express";
import { endPointsRoles } from "./job.endPoints.role.js";
import { validationMiddleWare } from "../../middlewares/validation.middleware.js";
import expressAsyncHandler from "express-async-handler";
import * as jc from "./job.controller.js";
import { auth } from "../../middlewares/authmiddleware.js";
import {
  addJobSchema,
  updatedJobSchema,
  deleteJobSchema,
  getAllJobsWithTheirCompanySchema,
  getAllJobsMatchFiltersSchema,
  applyJobSchema,
} from "./job.validation.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router = Router();

router.post(
  "/addjob",
  auth(endPointsRoles.HR),
  validationMiddleWare(addJobSchema),
  expressAsyncHandler(jc.addJob)
);

router.put(
  "/updatejob",
  auth(endPointsRoles.HR),
  validationMiddleWare(updatedJobSchema),
  expressAsyncHandler(jc.updateJob)
);

router.delete(
  "/deletejob",
  auth(endPointsRoles.HR),
  validationMiddleWare(deleteJobSchema),
  expressAsyncHandler(jc.deleteJob)
);

router.get(
  "/getAllJobsWithTheirCompany",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsWithTheirCompanySchema),
  expressAsyncHandler(jc.getAllJobsWithTheirCompany)
);

router.get(
  "/getAllJobsSpecificCompany",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsWithTheirCompanySchema),
  expressAsyncHandler(jc.getAllJobsSpecificCompany)
);

router.get(
  "/getAllJobsMatchFilters",
  auth(endPointsRoles.userAndHR),
  validationMiddleWare(getAllJobsMatchFiltersSchema),
  expressAsyncHandler(jc.getAllJobsMatchFilters)
);
router.post(
  "/applyJob",
  auth(endPointsRoles.user),
  multerMiddleHost({
    extensions: allowedExtensions.document,
  }).single("cv"),
  validationMiddleWare(applyJobSchema),
  expressAsyncHandler(jc.applyJob)
);
export default router;
