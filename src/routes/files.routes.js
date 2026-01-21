import { Router } from "express";
import multer from "multer";
import multerConfig from "../config/multerConfig.js";

import FileController from "../controllers/FileController.js";

import loginRequired from "../middlewares/loginRequired.js";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/", loginRequired, upload.single("file"), FileController.store);

export default routes;
