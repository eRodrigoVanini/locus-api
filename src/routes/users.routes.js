import { Router } from "express";
import UserController from "../controllers/UserController.js";
import loginRequired from "../middlewares/loginRequired.js";

const routes = Router();

routes.post("/", UserController.store);
routes.get("/", loginRequired, UserController.index);
routes.get("/show/", loginRequired, UserController.show);
routes.put("/", loginRequired, UserController.update);

export default routes;
