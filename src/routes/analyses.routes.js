import { Router } from "express";

const routes = Router();

// Importando os Controllers
import {
  createAnalysis,
  getAllAnalyses,
  deleteAnalysis,
} from "../controllers/AnalysisController.js";


// Rotas da Aplicação

routes.post("/", createAnalysis); // Quando bater em /users, chama a função createUser do userController
routes.get("/", getAllLots); // Quando bater em /users, chama a função getAllUsers do userController
routes.delete("/:id", deleteLot); // Quando bater em /users/:id, chama a função deleteUser do userController

export default routes;
