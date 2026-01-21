export default {
  async up(queryInterface, Sequelize) {
    // Ação: Remover a coluna 'path' da tabela 'files'
    await queryInterface.removeColumn("files", "path");
  },

  async down(queryInterface, Sequelize) {
    // Segurança: Se desfazer a migration, cria a coluna de volta
    await queryInterface.addColumn("files", "path", {
      type: Sequelize.STRING,
      allowNull: true, // true para evitar erros ao voltar dados antigos
    });
  },
};
