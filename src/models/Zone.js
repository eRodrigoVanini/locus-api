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
  // Zone pertence a uma City
  static associate(models) {
    this.belongsTo(models.City, { foreignKey: "city_id", as: "city" });
  }
}



export default City;
