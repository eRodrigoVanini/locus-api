import UrbanParameter from "../models/UrbanParameter.js";

class UrbanParameters {
  async index(req, res) {
    try {
      const urbanParameter = await UrbanParameter.findAll({
        attributes: ["id"],
        order: [["id", "ASC"]],
      });

      return res.json(urbanParameter);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
  async store(req, res) {
    try {
      const {
        zone_id,
        use_type_id,
        max_floor_area_ratio,
        min_lot_area,
        max_density,
        max_lot_coverage,
        max_permeability_rate,
        max_height,
        min_front_setback,
      } = req.body;

      const urbanParameter = await UrbanParameter.create({
        zone_id,
        use_type_id,
        max_floor_area_ratio,
        min_lot_area,
        max_density,
        max_lot_coverage,
        max_permeability_rate,
        max_height,
        min_front_setback,
      });
      return res.status(201).json(urbanParameter);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new UrbanParameters();
