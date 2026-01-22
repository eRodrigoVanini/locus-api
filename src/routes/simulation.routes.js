import { Router } from "express";
import SimulationController from "../controllers/SimulationController.js";

const routes = new Router();

routes.post("/", SimulationController.store);

export default routes;
