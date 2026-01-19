const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    //CRIA A TABELA DE
    await queryInterface.createTable("cities", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      state: {
        type: Sequelize.STRING(2),
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

  //Caso der errado
  async down(queryInterface) {
    await queryInterface.dropTable("cities");
  },
};
