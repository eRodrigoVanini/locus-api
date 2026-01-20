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
          type: Sequelize.FLOAT, // Área total do terreno
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING, // Ex: "available", "sold", "analyzed"
          defaultValue: "available",
        },
        // Chaves Estrangeiras
        user_id: {
          type: Sequelize.UUID,
          references: { model: 'users', key: 'id' },
          allowNull: false,
        },
        zone_id: {
          type: Sequelize.UUID,
          references: { model: 'zones', key: 'id' },
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
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'owner' });
    this.belongsTo(models.Zone, { foreignKey: 'zone_id', as: 'zone' });
    
    // Associação com FOTOS (Usando a tabela File existente)
    this.belongsToMany(models.File, { 
      through: 'lot_files', 
      as: 'photos',
      foreignKey: 'lot_id'
    });
  }
}

export default Lot;