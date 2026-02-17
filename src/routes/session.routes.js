import { Router } from "express";
import SessionController from "../controllers/SessionController.js";

const routes = Router();

routes.post("/", SessionController.store);

export default routes;
