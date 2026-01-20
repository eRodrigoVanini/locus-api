import * as Yup from "yup";
import Analysis from "../models/Analysis.js";
import Lot from "../models/Lot.js";
import UrbanParameter from "../models/UrbanParameter.js";
import Zone from "../models/Zone.js";
import UseType from "../models/UseType.js";

// CRIAR ANÁLISE (O Cálculo Matemático)
export const createAnalysis = async (req, res) => {
  try {
    // 1. Validação
    const schema = Yup.object().shape({
      lot_id: Yup.string().uuid().required(),
      use_type_id: Yup.string().uuid().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: "Validação falhou. Informe lot_id e use_type_id." });
    }

    const { lot_id, use_type_id } = req.body;

    // 2. Buscar o Lote (Precisamos da Área Total e da Zona dele)
    const lot = await Lot.findByPk(lot_id, {
      include: [{ model: Zone, as: "zone" }],
    });

    if (!lot) {
      return res.status(404).json({ error: "Lote não encontrado." });
    }

    // Segurança: Verifica se o lote pertence ao usuário logado
    if (lot.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para analisar este lote." });
    }

    // 3. Buscar os Parâmetros Urbanísticos (A Regra do Jogo)
    // "Quais as regras para essa Zona e esse Tipo de Uso?"
    const params = await UrbanParameter.findOne({
      where: {
        zone_id: lot.zone_id,
        use_type_id: use_type_id,
      },
      include: [{ model: UseType, as: "use_type" }], // Traz o nome do uso para o snapshot
    });

    if (!params) {
      return res.status(400).json({
        error:
          "Este tipo de uso não é permitido ou não foi parametrizado para a zona deste lote.",
      });
    }

    // 4. O CÁLCULO (A Inteligência do Sistema)
    // Convertendo strings/decimals para Float para garantir a matemática correta
    const area = parseFloat(lot.total_area);
    const ca = parseFloat(params.max_floor_area_ratio || 0); // Coef. Aproveitamento
    const to = parseFloat(params.max_lot_coverage || 0); // Taxa Ocupação (0.5 = 50%)
    const tp = parseFloat(params.min_permeability_rate || 0); // Taxa Permeabilidade

    const results = {
      lot_id,
      use_type_id,
      // Área Construída Máxima = Área Terreno * C.A.
      max_buildable_area: area * ca,

      // Área Máxima no Térreo (Projeção) = Área Terreno * T.O.
      max_ground_floor_area: area * to,

      // Área Permeável Mínima (Jardim) = Área Terreno * T.P.
      min_permeable_area: area * tp,

      // Copia valores diretos
      max_height: params.max_height,
      max_floors: null, // Se tiver esse dado no params, adicione aqui

      // SNAPSHOT: Salva as regras usadas hoje. Se a lei mudar, essa análise fica preservada.
      snapshot_params: params,
    };

    // 5. Salvar no Banco
    const analysis = await Analysis.create(results);

    return res.status(201).json(analysis);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao processar análise." });
  }
};

// LISTAR ANÁLISES DE UM LOTE
export const getAnalysesByLot = async (req, res) => {
  try {
    const { lot_id } = req.params;

    // Verifica se o lote existe e é do usuário
    const lot = await Lot.findByPk(lot_id);
    if (!lot) return res.status(404).json({ error: "Lote não encontrado." });
    if (lot.user_id !== req.userId)
      return res.status(401).json({ error: "Sem permissão." });

    const analyses = await Analysis.findAll({
      where: { lot_id },
      include: [{ model: UseType, as: "use_type", attributes: ["name"] }],
      order: [["created_at", "DESC"]],
    });

    return res.json(analyses);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// DETALHE DE UMA ANÁLISE ESPECÍFICA
export const getAnalysisDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const analysis = await Analysis.findByPk(id, {
      include: [
        {
          model: Lot,
          as: "lot",
          attributes: ["id", "name", "user_id"], // Precisamos do user_id pra checar permissão
        },
        { model: UseType, as: "use_type", attributes: ["name"] },
      ],
    });

    if (!analysis) {
      return res.status(404).json({ error: "Análise não encontrada." });
    }

    // Segurança: Só o dono do lote vê a análise
    if (analysis.lot.user_id !== req.userId) {
      return res.status(401).json({
        error: "Você não tem permissão para visualizar esta análise.",
      });
    }

    return res.json(analysis);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
