import { v4 as uuidv4 } from "uuid";

export default {
  async up(queryInterface, Sequelize) {
    const useTypesList = [
      "Unifamiliar",
      "Misto Unifamiliar",
      "Multifamiliar",
      "Comercial",
      "Residencial",
      "Pequenas Indústrias",
    ];

    // Transforma a lista de nomes em objetos completos para o banco
    const useTypesToInsert = useTypesList.map((name) => ({
      id: uuidv4(),
      name: name,
      description: null, // Campo opcional vazio
      created_at: new Date(),
      updated_at: new Date(),
    }));

    // Insere tudo de uma vez
    await queryInterface.bulkInsert("uses_types", useTypesToInsert, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "uses_types",
      {
        name: [
          "Unifamiliar",
          "Misto Unifamiliar",
          "Multifamiliar",
          "Comercial",
          "Residencial",
          "Pequenas Indústrias",
        ],
      },
      {},
    );
  },
};
