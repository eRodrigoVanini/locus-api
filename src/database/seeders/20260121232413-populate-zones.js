import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface, Sequelize) {
    // 1. Busca o ID da cidade pelo nome exato no banco
    // 'cities' é o nome da tabela no banco
    const cityId = await queryInterface.rawSelect(
      "cities",
      {
        where: {
          name: "Salto",
        },
      },
      ["id"],
    );

    if (!cityId) {
      console.error(
        "ERRO: Cidade não encontrada. Cadastre a cidade antes de rodar este seed.",
      );
      return; // Para a execução
    }

    const zonesList = [
      { name: "Residencial Unifamiliar", acronym: "ZRU" },
      { name: "Predominância Residencial", acronym: "ZPR" },
      { name: "Predominância Comercial", acronym: "ZPC" },
      { name: "Predominância Industrial", acronym: "ZPI" },
      { name: "Especial de Interesse Social", acronym: "ZEIS" },
      { name: "Área Central Consolidade", acronym: "ACC" },
      { name: "APA Lavras", acronym: "Zona 4" },
    ];

    const zonesToInsert = zonesList.map((zone) => ({
      id: uuidv4(),
      name: zone.name,
      acronym: zone.acronym,
      description: null,
      city_id: cityId, // Usa o ID que encontrou no banco
      created_at: new Date(),
      updated_at: new Date(),
    }));

    await queryInterface.bulkInsert("zones", zonesToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    // Primeiro busca o ID de novo para saber o que apagar
    const cityId = await queryInterface.rawSelect(
      "cities",
      {
        where: { name: "Lavras" },
      },
      ["id"],
    );

    if (cityId) {
      await queryInterface.bulkDelete("zones", { city_id: cityId }, {});
    }
  },
};
