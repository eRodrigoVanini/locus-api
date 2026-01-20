import Sequelize from "sequelize";
import config from "../config/database.js";

//IMPORTAR TODOS OS MODELS AQUI
import City from "./City.js";
import Zone from "./Zone.js";
import Analysis from "./Analysis.js";
import File from "./File.js";
import Lot from "./Lot.js";
import UrbanParameter from "./UrbanParameter.js";
import User from "./User.js";
import UsesTypes from "./UseType.js";

//INICIALIZAR A CONEXÃO
const sequelize = new Sequelize(config);

//LISTA DE MODELS
// Toda vez que criar um arquivo novo, adiciono neste array
const models = [
  City,
  Zone,
  Analysis,
  File,
  Lot,
  UrbanParameter,
  User,
  UsesTypes,
];

//INICIALIZAR
models.forEach((model) => model.init(sequelize));

//ASSOCIAR (associate)
// Verifica se o método associate existe antes de chamar
models.forEach((model) => {
  if (model.associate) {
    model.associate(sequelize.models);
  }
});

//EXPORTAR
// Exporto um objeto contendo a conexão (sequelize) e a biblioteca (Sequelize)
// e espalho (...sequelize.models) para ter acesso direto aos models (db.City, db.User)
const db = {
  sequelize,
  Sequelize,
  ...sequelize.models,
};

export default db;
