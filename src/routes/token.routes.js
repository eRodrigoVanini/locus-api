import { Router } from "express";
import TokenController from "../controllers/TokenController.js";
const routes = Router();

routes.post("/", TokenController.store);

export default routes;
