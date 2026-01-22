// nova migration: YYYYMMDDHHMMSS-modify-zones-string-lengths.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'name', {
    type: Sequelize.STRING(100), // coloque o tamanho que você definiu
    allowNull: false,
  });

  await queryInterface.changeColumn('zones', 'description', {
    type: Sequelize.TEXT, // ou STRING(500), depende do que você precisa
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'name', {
    type: Sequelize.STRING(255),
    allowNull: false,
  });

  await queryInterface.changeColumn('zones', 'description', {
    type: Sequelize.STRING(255),
    allowNull: true,
  });
}// nova migration: YYYYMMDDHHMMSS-modify-zones-string-lengths.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'name', {
    type: Sequelize.STRING(100), // coloque o tamanho que você definiu
    allowNull: false,
  });

  await queryInterface.changeColumn('zones', 'description', {
    type: Sequelize.TEXT, // ou STRING(500), depende do que você precisa
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn('zones', 'name', {
    type: Sequelize.STRING(255),
    allowNull: false,
  });

  await queryInterface.changeColumn('zones', 'description', {
    type: Sequelize.STRING(255),
    allowNull: true,
  });
}