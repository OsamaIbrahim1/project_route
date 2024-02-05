import { systemRole } from "../../utils/systemRoles.js";

export const endPointsRoles = {
  HR: [systemRole.HR],
  userAndHR: [systemRole.HR, systemRole.USER],
  user: [systemRole.USER],
};
