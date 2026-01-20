import { Router } from "express";

const routes = Router();

// Importando os Controllers
import {
  store,
  index,
  getLot,
  deleteLot,
  updateLot,
} from "../controllers/LotController.js";

// Rotas da Aplicação

routes.post("/", store);
routes.get("/", index);
routes.get("/:id", getLot);
routes.delete("/:id", deleteLot);
routes.put("/:id", updateLot);

export default routes;
