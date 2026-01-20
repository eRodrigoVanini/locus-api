/*import usersRoutes from "./users.routes.js";*/
import citiesRoutes from "./cities.routes.js";

const routes = (app) => {
  app.use("/cities", citiesRoutes);
};

export default routes;
