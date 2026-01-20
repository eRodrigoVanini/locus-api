import Sequelize, { Model } from "sequelize";

class City extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
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
