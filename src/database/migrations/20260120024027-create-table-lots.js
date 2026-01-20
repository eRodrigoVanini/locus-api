import Sequelize from 'sequelize';

export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lots', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
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
        type: Sequelize.FLOAT, // Área em m²
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'available', // ex: available, sold, building
        allowNull: false,
      },
      // CHAVE ESTRANGEIRA: Dono do Lote
      user_id: {
        type: Sequelize.UUID,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', // Se deletar o usuário, deleta os lotes dele (ou use SET NULL)
        allowNull: false,
      },
      // CHAVE ESTRANGEIRA: Zona onde o lote está
      zone_id: {
        type: Sequelize.UUID,
        references: { model: 'zones', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // Não deixa deletar uma zona se houver lotes nela
        allowNull: false,
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
    await queryInterface.dropTable('lots');
  },
};