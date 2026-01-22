export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'acronym', {
    type: Sequelize.STRING(15),
    allowNull: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'acronym', {
    type: Sequelize.STRING(2),
    allowNull: false,
  });
}