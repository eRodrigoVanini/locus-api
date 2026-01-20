import Sequelize, { Model } from 'sequelize';

class UrbanParameter extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        zone_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'zones', key: 'id' },
        },
        use_type_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'uses_types', key: 'id' },
        },
        // Parâmetros Urbanísticos
        max_floor_area_ratio: { // Coeficiente de Aproveitamento Máximo
          type: Sequelize.DECIMAL(8, 2),
          allowNull: true,
        },
        min_lot_area: { // Lote Mínimo
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        max_density: { // Densidade Máxima
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        max_lot_coverage: { // Taxa de Ocupação Máxima
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        min_permeability_rate: { // Taxa de Permeabilidade Mínima
          type: Sequelize.FLOAT,
          allowNull: true,
        },
        max_height: { // Altura Máxima
          type: Sequelize.DECIMAL(8, 2),
          allowNull: true,
        },
        min_front_setback: { // Recuo Frontal Mínimo
          type: Sequelize.DECIMAL(8, 2),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'urban_parameters',
      }
    );

    return this;
  }

  static associate(models) {
    // Pertence a uma Zona
    this.belongsTo(models.Zone, { foreignKey: 'zone_id', as: 'zone' });
    
    // Pertence a um Tipo de Uso
    this.belongsTo(models.UseType, { foreignKey: 'use_type_id', as: 'use_type' });
  }
}

export default UrbanParameter;