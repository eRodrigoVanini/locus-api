import Sequelize from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('urban_parameters', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      // FK para Zones
      zone_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'zones', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Se apagar a zona, apaga os parâmetros dela
      },
      // FK para Uses Types
      use_type_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'uses_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Evita apagar um tipo de uso se houver regras usando ele
      },
      // Campos de Dados
      max_floor_area_ratio: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      min_lot_area: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_density: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_lot_coverage: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      min_permeability_rate: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_height: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      min_front_setback: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: true,
      },
      // Timestamps
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('urban_parameters');
  },
};