
export default {
  async up(queryInterface, Sequelize) {
    // Adiciona a regra: A combinação de zone_id + use_type_id não pode se repetir
    await queryInterface.addConstraint('urban_parameters', {
      fields: ['zone_id', 'use_type_id'], // As colunas que formam o par único
      type: 'unique',
      name: 'unique_zone_use_constraint' // Nome da restrição (importante para remover depois)
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove a restrição pelo nome definido acima
    await queryInterface.removeConstraint('urban_parameters', 'unique_zone_use_constraint');
  }
};