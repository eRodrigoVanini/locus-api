import { Router } from "express";
import UseTypeController from "../controllers/UseTypeController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();

routes.get("/", UseTypeController.index);
routes.get("/show/", UseTypeController.show);
routes.post("/", loginRequired, UseTypeController.store);
routes.delete("/:id", loginRequired, UseTypeController.delete);
routes.put("/:id", loginRequired, UseTypeController.update);

export default routes;
