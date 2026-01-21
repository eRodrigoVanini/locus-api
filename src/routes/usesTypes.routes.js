import { Router } from "express";
import UseTypeController from "../controllers/UseTypeController.js";

const routes = Router();

routes.get("/", UseTypeController.index);
routes.get("/show/:id", UseTypeController.show);
routes.post("/", UseTypeController.store);
routes.delete("/:id", UseTypeController.delete);
routes.put("/:id", UseTypeController.update);

export default routes;
