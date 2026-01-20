import { Router } from "express";
import {
  createAnalysis,
  getAnalysesByLot,
  getAnalysisDetails,
} from "../controllers/AnalysisController.js";

const routes = Router();

// Rotas da Aplicação

routes.post("/", createAnalysis);

export default routes;
