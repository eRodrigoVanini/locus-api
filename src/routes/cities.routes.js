import { Router } from "express";
import CityController from "../controllers/CityController.js";

const routes = Router();

routes.get("/", CityController.index);
routes.get("/show/:id", CityController.show);
routes.post("/", CityController.store);
routes.delete("/:id", CityController.delete);
routes.put("/:id", CityController.update);

export default routes;
