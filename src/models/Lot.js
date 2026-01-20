import Sequelize, { Model } from "sequelize";

class Lot extends Model {
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
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        lot_total_area: {
          type: Sequelize.FLOAT,
          allowNull: false,
        },
        lot_status: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        zone_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "zones",
            key: "id",
          },
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "use_types",
            key: "id",
          },
        },
        city_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: "cities",
            key: "id",
          },
        },
      },
      { sequelize, tableName: "lots" },
    );
  }


  static associate(models) {
    this.belongsTo(models.Zones, { foreignKey: "zone_id", as: "zone" });

    this.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

export default Lot;
