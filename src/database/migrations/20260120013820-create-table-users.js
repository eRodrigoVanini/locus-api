import { Sequelize } from "sequelize";

export default {
  async up(queryInterface, Sequelize) {
    //Cria a tabela de usuários
    await queryInterface.createTable("users", {
      id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      birthdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      avatar_id: {
        type: Sequelize.UUID,
        references: { model: "files", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  //Caso der errado
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
