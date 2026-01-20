const { DataTypes } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    //CRIA A TABELA DE ZONAS
    await queryInterface.createTable("zones", {
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
      acronym: {
        type: Sequelize.STRING(2),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "cities",
          key: "id",
        },
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
    await queryInterface.dropTable("zones");
  },
};
