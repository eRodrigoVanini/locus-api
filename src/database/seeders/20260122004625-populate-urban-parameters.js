import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface, Sequelize) {
    // 1. Busca as referências (FKs) do banco
    const [zones] = await queryInterface.sequelize.query('SELECT id, name, acronym FROM zones');
    const [useTypes] = await queryInterface.sequelize.query('SELECT id, name FROM uses_types');

    if (!zones.length || !useTypes.length) {
      console.error('❌ ERRO: Tabelas de Zonas ou Tipos de Uso vazias.');
      return;
    }

    // Helpers para encontrar IDs sem case-sensitivity 
    const findZone = (text) => zones.find(z => 
      z.name.toLowerCase() === text.toLowerCase() || 
      (z.acronym && z.acronym.toLowerCase() === text.toLowerCase())
    )?.id;

    const findUse = (text) => useTypes.find(u => 
      u.name.toLowerCase() === text.toLowerCase()
    )?.id;

    // 2. Definição da Matriz de Dados
    // "quebrar" as linhas agrupadas da tabela
    const rules = [
      // --- 1. Residencial Unifamiliar ---
      {
        zoneName: 'Residencial Unifamiliar',
        useName: 'Unifamiliar',
        min_lot_area: 200,
        max_density: 170,
        max_floor_area_ratio: 1.2,
        max_lot_coverage: 0.6 // 60%
      },

      // --- 2. Predominância Residencial ---
      // Lógica: 60% para Residencial, 70% para Comercial
      {
        zoneName: 'Predominância Residencial',
        useName: 'Misto Unifamiliar',
        min_lot_area: 175,
        max_density: 300,
        max_floor_area_ratio: 2.5,
        max_lot_coverage: 0.6 // Res
      },
      {
        zoneName: 'Predominância Residencial',
        useName: 'Multifamiliar',
        min_lot_area: 175,
        max_density: 300,
        max_floor_area_ratio: 2.5,
        max_lot_coverage: 0.6 // Res
      },
      {
        zoneName: 'Predominância Residencial',
        useName: 'Comercial',
        min_lot_area: 175,
        max_density: 300,
        max_floor_area_ratio: 2.5,
        max_lot_coverage: 0.7 // Com (70%)
      },

      // --- 3. Predominância Comercial ---
      // Lógica: 70% (Residencial) / 80% (Comercial)
      {
        zoneName: 'Predominância Comercial',
        useName: 'Residencial', 
        min_lot_area: null, 
        max_density: 400,
        max_floor_area_ratio: 5.2,
        max_lot_coverage: 0.7 // 70% Se Residencial
      },
      {
        zoneName: 'Predominância Comercial',
        useName: 'Comercial',
        min_lot_area: null,
        max_density: 400,
        max_floor_area_ratio: 5.2,
        max_lot_coverage: 0.8 // 80% Se Comercial
      },
      {
        zoneName: 'Predominância Comercial',
        useName: 'Pequenas Indústrias',
        min_lot_area: null,
        max_density: 400,
        max_floor_area_ratio: 5.2,
        max_lot_coverage: 0.8 // Assumindo padrão não-residencial
      },

      // --- 4. Predominância Industrial ---
      {
        zoneName: 'Predominância Industrial',
        useName: 'Pequenas Indústrias', // Uso inferido
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 2.0,
        max_lot_coverage: 0.8 // 80%
      },

      // --- 5. Especial Interesse Social (ZEIS) ---
      {
        zoneName: 'Especial de Interesse Social',
        useName: 'Unifamiliar', // ZEIS geralmente engloba ambos
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 1.6,
        max_lot_coverage: 0.7 // 70%
      },
      {
        zoneName: 'Especial de Interesse Social',
        useName: 'Multifamiliar',
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 1.6,
        max_lot_coverage: 0.7 // 70%
      },

      // --- 6. Área Central Consolidada ---
      // Lógica: 70% (Res) / 80% (Com)
      {
        zoneName: 'Área Central Consolidade', 
        useName: 'Multifamiliar', // Residencial
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 5.0,
        max_lot_coverage: 0.7 // 70%
      },
      {
        zoneName: 'Área Central Consolidade',
        useName: 'Comercial', // Comercial
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 5.0,
        max_lot_coverage: 0.8 // 80%
      },

      // --- 7. APA - Lavras ---
      {
        zoneName: 'APA Lavras', 
        useName: 'Unifamiliar',
        min_lot_area: null,
        max_density: null,
        max_floor_area_ratio: 1.2,
        max_lot_coverage: 0.5 // 50%
      }
    ];

    const dataToInsert = [];

    // 3. Cruzamento de Dados e Tratamento de Erros
    for (const rule of rules) {
      const zoneId = findZone(rule.zoneName);
      // Tenta achar o uso; se for 'Residencial' (genérico) e não achar, tenta mapear para 'Multifamiliar' se preferir, 
      // ou garante que existe 'Residencial' na tabela use_types.
      let useId = findUse(rule.useName);
      
      // Fallback: Se o seed pede "Residencial" mas no banco só tem "Multifamiliar", fazemos um "de-para" simples
      if (!useId && rule.useName === 'Residencial') useId = findUse('Multifamiliar'); 
      if (!useId && rule.zoneName.includes('APA')) useId = findUse('Unifamiliar'); // Fallback para APA

      if (zoneId && useId) {
        dataToInsert.push({
          id: uuidv4(),
          zone_id: zoneId,
          use_type_id: useId,
          min_lot_area: rule.min_lot_area,
          max_density: rule.max_density,
          max_floor_area_ratio: rule.max_floor_area_ratio,
          max_lot_coverage: rule.max_lot_coverage,
          min_permeability_rate: 0.05, // Definindo padrão de 5% se não especificado, ou null
          created_at: new Date(),
          updated_at: new Date()
        });
      } else {
        console.warn(`⚠️ Ignorado: Zona "${rule.zoneName}" ou Uso "${rule.useName}" não encontrados.`);
      }
    }

    // 4. Inserção
    if (dataToInsert.length > 0) {
      await queryInterface.bulkInsert('urban_parameters', dataToInsert, {});
      console.log(`✅ Sucesso! ${dataToInsert.length} parâmetros inseridos.`);
    } else {
      console.log('❌ Nada inserido. Verifique os nomes das zonas e usos.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('urban_parameters', null, {});
  }
};