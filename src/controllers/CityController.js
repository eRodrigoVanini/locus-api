import City from "../models/City.js";

class CitiesController {
  // LISTAR TODOS OS MUNICÍPIOS
  async index(req, res) {
    try {
      const cities = await City.findAll({ 
        attributes: ["id", "name", "state"],
        order: [["name", "ASC"]],
      });

      return res.json(cities);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // CRIAR MUNICÍPIO
  async store(req, res) {
    try {
      const { name, state } = req.body; 

      const city = await City.create({ name, state });
      return res.status(201).json(city);
    } catch (error) {
      return res.status(400).json({ error: error.message }); 
    }
  }

  // DELETAR MUNICÍPIO
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await City.destroy({ where: { id } });

      if (!deleted) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // ATUALIZAR MUNICÍPIO
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, state } = req.body;

      const city = await City.findByPk(id);

      if (!city) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }

      await city.update({ name, state });

      return res.json(city);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new CitiesController();