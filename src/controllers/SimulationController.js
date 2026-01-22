import * as Yup from "yup";
import SimulationService from "../services/SimulationService.js";

class SimulationController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        zone_id: Yup.string().uuid().required(),
        use_type_id: Yup.string().uuid().required(),
        lot_area: Yup.number().positive().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res
          .status(400)
          .json({
            error:
              "Validação falhou. Verifique zone_id, use_type_id e lot_area.",
          });
      }

      const { zone_id, use_type_id, lot_area } = req.body;

      const result = await SimulationService.calculate({
        zone_id,
        use_type_id,
        lot_area,
      });

      return res.json(result);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new SimulationController();
