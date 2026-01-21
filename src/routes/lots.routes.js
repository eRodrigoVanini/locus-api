import { Router } from "express";
import LotController from "../controllers/LotController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();


// Rotas da Aplicação

routes.post("/", loginRequired, LotController.store);
routes.get("/", loginRequired, LotController.index);
routes.get("/:id", loginRequired, LotController.show);
routes.delete("/:id", loginRequired, LotController.delete);
routes.put("/:id", loginRequired, LotController.update);

export default routes;
