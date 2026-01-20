import Sequelize, { Model } from 'sequelize';

class Analysis extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        // Resultados Calculados (Outputs)
        max_buildable_area: Sequelize.FLOAT,       // Área computável máxima
        max_ground_floor_area: Sequelize.FLOAT,    // Taxa de ocupação (em m²)
        max_height: Sequelize.FLOAT,               // Altura máxima
        max_floors: Sequelize.INTEGER,             // Número de andares
        min_permeable_area: Sequelize.FLOAT,       // Área permeável mínima
        
        // Cópia das Regras (Para histórico)
        snapshot_params: {
          type: Sequelize.JSON, 
          allowNull: true,
        },
        
        // Relacionamentos
        lot_id: {
          type: Sequelize.UUID,
          references: { model: 'lots', key: 'id' },
          allowNull: false,
        },
        use_type_id: {
          type: Sequelize.UUID,
          references: { model: 'uses_types', key: 'id' },
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'analyses', // Plural de analysis
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Lot, { foreignKey: 'lot_id', as: 'lot' });
    this.belongsTo(models.UseType, { foreignKey: 'use_type_id', as: 'use_type' });
  }
}

export default Analysis;