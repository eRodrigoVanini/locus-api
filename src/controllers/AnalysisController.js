import * as Yup from "yup";
import Analysis from "../models/Analysis.js";
import Lot from "../models/Lot.js";
import UrbanParameter from "../models/UrbanParameter.js";
import Zone from "../models/Zone.js";
import UseType from "../models/UseType.js";

class AnalysisController {
  // 1. CRIAR ANÁLISE (STORE)
  async store(req, res) {
    try {
      // Validação
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

      // Buscar o Lote 
      const lot = await Lot.findByPk(lot_id, {
        include: [{ model: Zone, as: "zone" }],
      });

      if (!lot) {
        return res.status(404).json({ error: "Lote não encontrado." });
      }

      // Verifica se o lote pertence ao usuário logado
      if (lot.user_id !== req.userId) {
        return res
          .status(401)
          .json({ error: "Você não tem permissão para analisar este lote." });
      }

      // Buscar os Parâmetros Urbanísticos
      const params = await UrbanParameter.findOne({
        where: {
          zone_id: lot.zone_id,
          use_type_id: use_type_id,
        },
        include: [{ model: UseType, as: "use_type" }],
      });

      if (!params) {
        return res.status(400).json({
          error:
            "Este tipo de uso não é permitido ou não foi parametrizado para a zona deste lote.",
        });
      }

      // O CÁLCULO
      const area = parseFloat(lot.total_area);
      const ca = parseFloat(params.max_floor_area_ratio || 0);
      const to = parseFloat(params.max_lot_coverage || 0);
      const tp = parseFloat(params.min_permeability_rate || 0);

      const results = {
        lot_id,
        use_type_id,
        max_buildable_area: area * ca, // Área Construída Máxima
        max_ground_floor_area: area * to, // Área Térreo Máxima
        min_permeable_area: area * tp, // Área Permeável Mínima
        max_height: params.max_height,
        max_floors: null,
        snapshot_params: params, // Salva a regra usada
      };

      const analysis = await Analysis.create(results);

      return res.status(201).json(analysis);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao processar análise." });
    }
  }

  // 2. LISTAR ANÁLISES DE UM LOTE (INDEX)
  async index(req, res) {
    try {
      const { lot_id } = req.params;

      // Verifica se o lote existe e é do usuário
      const lot = await Lot.findByPk(lot_id);

      if (!lot) return res.status(404).json({ error: "Lote não encontrado." });

      if (lot.user_id !== req.userId) {
        return res.status(401).json({ error: "Sem permissão." });
      }

      const analyses = await Analysis.findAll({
        where: { lot_id },
        include: [{ model: UseType, as: "use_type", attributes: ["name"] }],
        order: [["created_at", "DESC"]],
      });

      return res.json(analyses);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 3. DETALHE DE UMA ANÁLISE (SHOW)
  async show(req, res) {
    try {
      const { id } = req.params;

      const analysis = await Analysis.findByPk(id, {
        include: [
          {
            model: Lot,
            as: "lot",
            attributes: ["id", "name", "user_id"],
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
  }
}

export default new AnalysisController();
