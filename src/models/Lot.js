import Sequelize, { Model } from 'sequelize';

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
        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        total_area: {
          type: Sequelize.FLOAT, // Área total do terreno em m²
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING, // 'available', 'analyzed', etc
          defaultValue: 'available',
        },
        // Apenas os tipos das FKs aqui para o Sequelize saber
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        zone_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'lots',
      }
    );

    return this;
  }

  static associate(models) {
    // Lote pertence a um Usuário
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
    
    // Lote pertence a uma Zona
    this.belongsTo(models.Zone, { foreignKey: 'zone_id', as: 'zone' });
  }
}

export default Lot;