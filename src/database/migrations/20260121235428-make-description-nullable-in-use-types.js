
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('uses_types', 'description', {
      type: Sequelize.STRING, // É obrigatório reafirmar o tipo do dado
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('uses_types', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  }
};