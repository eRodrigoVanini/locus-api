import { Router } from "express";
import { store } from "../controllers/UserController.js";

const routes = Router();

routes.post("/", store);

export default routes;
