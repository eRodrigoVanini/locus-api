import UrbanParameter from "../models/UrbanParameter.js";
import Zone from "../models/Zone.js";
import UseType from "../models/UseType.js";

class SimulationService {
  async calculate({ zone_id, use_type_id, lot_area }) {
    //Busca os parâmetros no banco
    const params = await UrbanParameter.findOne({
      where: {
        zone_id,
        use_type_id,
      },
      include: [
        { model: Zone, as: "zone", attributes: ["name", "acronym"] },
        { model: UseType, as: "use_type", attributes: ["name"] },
      ],
    });

    if (!params) {
      throw new Error(
        "Parâmetros não encontrados para esta combinação de Zona e Uso.",
      );
    }

    //Validação: O lote é grande o suficiente?
    const is_lot_allowed = params.min_lot_area
      ? lot_area >= params.min_lot_area
      : true;

    //Cálculos Matemáticos (A Lógica de Negócio)

    // Potencial Construtivo (Área total que pode ter de chão construído somando andares)
    // Fórmula: Área do Terreno * Coeficiente de Aproveitamento (CA)
    const max_construction_area = params.max_floor_area_ratio
      ? (lot_area * params.max_floor_area_ratio).toFixed(2)
      : null;

    // Área Máxima de Ocupação (A "sombra" do prédio no chão)
    // Fórmula: Área do Terreno * Taxa de Ocupação (TO)
    const max_ground_floor_area = params.max_lot_coverage
      ? (lot_area * params.max_lot_coverage).toFixed(2)
      : null;

    // Área Mínima Permeável (Jardim/Terra que absorve água)
    // Fórmula: Área do Terreno * Taxa de Permeabilidade
    const min_permeable_area = params.min_permeability_rate
      ? (lot_area * params.min_permeability_rate).toFixed(2)
      : null;

    // Valor da Densidade Máxima (habitantes por hectare)
    const max_density = params.max_density.toFixed(3);

    //Retorna o objeto para o Frontend
    return {
      allowed: is_lot_allowed, // true ou false
      message: is_lot_allowed
        ? "Lote apto para construção."
        : `Lote menor que o mínimo exigido (${params.min_lot_area}m²).`,
      inputs: {
        lot_area,
        zone: params.zone.acronym,
        use: params.use_type.name,
      },
      indices: {
        // Retorna os índices originais para referência
        max_floor_area_ratio: params.max_floor_area_ratio,
        max_lot_coverage: params.max_lot_coverage,
        min_permeability_rate: params.min_permeability_rate,
        max_density: max_density,
      },
      results: {
        // Retorna os valores calculados em Metros Quadrados
        max_construction_area_m2: Number(max_construction_area),
        max_ground_floor_area_m2: Number(max_ground_floor_area),
        min_permeable_area_m2: Number(min_permeable_area),
        max_height_meters: params.max_height_meters,
        max_floors: params.max_floors,
      },
    };
  }
}

export default new SimulationService();
