import Sequelize, { Model } from "sequelize";

class Zone extends Model {
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
        acronym: {
          type: Sequelize.STRING(5),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        city_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      },
      { sequelize, tableName: "zones" },
    );

    return this;
  }
  // Zone pertence a uma City
  static associate(models) {
    this.belongsTo(models.City, { foreignKey: "city_id", as: "city" });
  }
}

export default Zone;
