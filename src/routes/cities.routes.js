import { Router } from "express";
import CityController from "../controllers/CityController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();

routes.get("/", CityController.index);
routes.get("/show/:id", CityController.show);
routes.post("/", loginRequired, CityController.store);
routes.delete("/:id", loginRequired, CityController.delete);
routes.put("/:id", loginRequired, CityController.update);

export default routes;
