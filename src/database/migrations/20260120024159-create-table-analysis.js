import Sequelize from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('analyses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      // FK: Lote analisado
      lot_id: {
        type: Sequelize.UUID,
        references: { model: 'lots', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Se o lote sumir, a análise some
        allowNull: false,
      },
      // FK: Tipo de uso pretendido (ex: Residencial)
      use_type_id: {
        type: Sequelize.UUID,
        references: { model: 'uses_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        allowNull: false,
      },
      // Resultados Calculados
      max_buildable_area: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_ground_floor_area: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_height: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      max_floors: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      min_permeable_area: {
        type: Sequelize.FLOAT, 
        allowNull: true,
      },
      //Histórico das regras usadas
      snapshot_params: {
        type: Sequelize.JSON, 
        allowNull: true,
      },
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
    await queryInterface.dropTable('analyses');
  },
};