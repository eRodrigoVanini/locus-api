import { v4 as uuidv4 } from 'uuid';


export default {
  async up(queryInterface, Sequelize) {

    const zonesList = [
      { name: 'Residencial Unifamiliar', acronym: 'ZRU' },
      { name: 'Predominância Residencial', acronym: 'ZPR' },
      { name: 'Predominância Comercial', acronym: 'ZPC' },
      { name: 'Predominância Industrial', acronym: 'ZPI' },
      { name: 'Especial de Interesse Social', acronym: 'ZEIS' },
      { name: 'Área Central Consolidade', acronym: 'ACC' },
      { name: 'APA Lavras', acronym: 'Zona 4' },
    ];

    // Mapeia e adiciona os campos obrigatórios (ID e Datas)
    const zonesToInsert = zonesList.map((zone) => ({
      id: uuidv4(),
      name: zone.name,
      acronym: zone.acronym,
      description: null,
      city_id: "da51adfa-7094-4334-9055-836ffbca2790",
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert('zones', zonesToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    // Apaga apenas as zonas dessa cidade específica
    await queryInterface.bulkDelete('zones', { 
      city_id: 'da51adfa-7094-4334-9055-836ffbca2790' 
    }, {});
  }
};