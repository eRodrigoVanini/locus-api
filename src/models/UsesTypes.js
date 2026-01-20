import Sequelize, { Model } from 'sequelize';

class UseType extends Model {
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
          type: Sequelize.STRING, 
          allowNull: true,     
        },
      },
      {
        sequelize,
        tableName: 'uses_types', 
      }
    );

    return this;
  }

  static associate(models) {
    // Futuramente:
    // this.hasMany(models.UrbanParameter, { foreignKey: 'use_type_id' });
    // this.hasMany(models.Analysis, { foreignKey: 'use_type_id' });
  }
}

export default UseType;