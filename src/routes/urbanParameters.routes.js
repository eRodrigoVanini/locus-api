import { Router } from "express";
import loginRequired from "../middlewares/loginRequired.js";
import UrbanParameters from "../controllers/UrbanParamemtersController.js";

const routes = Router();

routes.get("/", UrbanParameters.index);
routes.post("/", loginRequired, UrbanParameters.store);

export default routes;
