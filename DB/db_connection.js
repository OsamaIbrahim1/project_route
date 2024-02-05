import mongoose from "mongoose";

const db_connection = async () => {
  await mongoose
    .connect(process.env.connection_db)
    .then(() => {
      console.log("DB is Connection ");
    })
    .catch((err) => {
      console.log("DB Not Connected", err);
    });
};

export default db_connection;
