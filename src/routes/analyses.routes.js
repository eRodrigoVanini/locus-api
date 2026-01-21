import { Router } from "express";
import analysisRoutes from "../controllers/AnalysisController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();

// Rotas da Aplicação

routes.post("/", analysisRoutes.store);
routes.get("/", loginRequired, analysisRoutes.index);
routes.get("/show/", loginRequired, analysisRoutes.show);

export default routes;
