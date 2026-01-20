import dotenv from "dotenv";
dotenv.config();
import "./src/models/index.js";

import express from "express";
const app = express();
app.use(express.json());
const PORT = process.env.PORT;

import routes from "./src/routes/index.routes.js";

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
