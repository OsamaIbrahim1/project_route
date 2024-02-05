import express from "express";
import db_connection from "./DB/db_connection.js";
import { config } from "dotenv";
import userRouter from "./src/modules/user.module/user.route.js";
import companyRouter from "./src/modules/company.module/company.route.js";
import jobRouter from "./src/modules/job.module/job.route.js";
import { globalResponse } from "./src/middlewares/globalResponse.js";
config({ path: `./config/dev.config.env` });

const app = express();

app.use(express.json());

app.use("/users", userRouter);
app.use("/company", companyRouter);
app.use("/job", jobRouter);

app.use(globalResponse);

db_connection();
app.listen(process.env.port, () => {
  console.log(`server listening on port: ${+process.env.port}`);
});
