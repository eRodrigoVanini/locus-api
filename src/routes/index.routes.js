/*import usersRoutes from "./users.routes.js";*/
import citiesRoutes from "./cities.routes.js";
import filesRoutes from "./files.routes.js";
import lotsRoutes from "./lots.routes.js";
import urbanParametersRoutes from "./urbanParameters.routes.js";
import usersRoutes from "./users.routes.js";
import useTypesRoutes from "./usesTypes.routes.js";
import zonesRoutes from "./zones.routes.js";
import analysisRoutes from "./analysis.routes.js";

const routes = (app) => {
  app.use("/cities", citiesRoutes);
  app.use("/analysis", analysisRoutes);
  app.use("/files", filesRoutes);
  app.use("/lots", lotsRoutes);
  app.use("/urbanParameters", urbanParametersRoutes);
  app.use("/users", usersRoutes);
  app.use("/useTypes", useTypesRoutes);
  app.use("/zones", zonesRoutes);
};

export default routes;
