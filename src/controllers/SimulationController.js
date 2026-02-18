// src/controllers/SimulationController.js
import * as Yup from "yup";
import SimulationService from "../services/SimulationService.js";
import Lot from "../models/Lot.js"; 

class SimulationController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        zone_id: Yup.string().uuid().required(),
        use_type_id: Yup.string().uuid().required(),
        lot_area: Yup.number().positive().required(),
        save_as_lot: Yup.boolean().optional(),
        name: Yup.string().when("save_as_lot", (save_as_lot, field) =>
          save_as_lot
            ? field.required("Nome é obrigatório para salvar como lote.")
            : field,
        ),
        description: Yup.string().optional(),
      });


      await schema.validate(req.body, { abortEarly: false });

      const { zone_id, use_type_id, lot_area, save_as_lot, name, description } =
        req.body;

      const simulationResult = await SimulationService.calculate({
        zone_id,
        use_type_id,
        lot_area,
      });

      if (save_as_lot) {
        if (!req.userId) {
          return res
            .status(401)
            .json({ error: "Autenticação necessária para salvar lote." });
        }

       
        const newLot = await Lot.create({
          name,
          description: description || "Lote criado a partir de simulação",
          address: "Endereço padrão", 
          total_area: lot_area,
          zone_id,
          user_id: req.userId,
        });

        return res.status(201).json({
          simulation: simulationResult,
          saved_lot: {
            id: newLot.id,
            name: newLot.name,
            total_area: newLot.total_area,
            message: "Lote salvo com sucesso.",
          },
        });
      }

      return res.json(simulationResult);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).json({
          error: "Validação falhou.",
          details: error.errors,
        });
      }
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new SimulationController();
