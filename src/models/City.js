import Sequelize, { Model } from "sequelize";

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
      },
      { sequelize, tableName: "cities" },
    );

    return this;
  }

  // RELACIONAMENTO COM ZONAS
  static associate(models) {
    this.hasMany(models.Zone, {
      foreignKey: "city_id",
      as: "zones", 
    });
  }
}

export default City;
