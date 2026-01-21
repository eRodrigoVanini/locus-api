import { Router } from "express";
import ZoneController from "../controllers/ZoneController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();

routes.get("/", ZoneController.index);
routes.get("/show/:id", ZoneController.show);
routes.post("/", loginRequired, ZoneController.store);
routes.delete("/:id", loginRequired, ZoneController.delete);
routes.put("/:id", loginRequired, ZoneController.update);

export default routes;
