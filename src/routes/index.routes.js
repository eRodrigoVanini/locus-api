import usersRoutes from "./users.routes.js";

const routes = (app) => {
  app.use("/users", usersRoutes);
};

export default routes;
