import * as Yup from 'yup';
import Zone from '../models/Zone.js';
import City from '../models/City.js';
import UrbanParameter from '../models/UrbanParameter.js';
import UseType from '../models/UseType.js';

class ZoneController {
  // 1. CRIAR (STORE)
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        acronym: Yup.string().required(),
        description: Yup.string().required(),
        city_id: Yup.string().uuid().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      const zone = await Zone.create(req.body);
      return res.status(201).json(zone);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar zona.' });
    }
  }

  // 2. LISTAR (INDEX)
  async index(req, res) {
    try {
      const { city_id } = req.query;
      const where = city_id ? { city_id } : {};

      const zones = await Zone.findAll({
        where,
        include: [{ model: City, as: 'city', attributes: ['name', 'state'] }],
        order: [['name', 'ASC']],
      });

      return res.json(zones);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar zonas.' });
    }
  }

  // 3. MOSTRAR UM (SHOW)
  async show(req, res) {
    try {
      const { id } = req.params;

      const zone = await Zone.findByPk(id, {
        include: [
          { model: City, as: 'city' },
          {
            model: UrbanParameter,
            as: 'parameters',
            include: [{ model: UseType, as: 'use_type', attributes: ['name'] }],
          },
        ],
      });

      if (!zone) {
        return res.status(404).json({ error: 'Zona não encontrada.' });
      }

      return res.json(zone);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar detalhes da zona.' });
    }
  }

  // 4. ATUALIZAR (UPDATE)
  async update(req, res) {
    try {
      const { id } = req.params;

      const schema = Yup.object().shape({
        name: Yup.string(),
        acronym: Yup.string(),
        description: Yup.string(),
        city_id: Yup.string().uuid(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      const zone = await Zone.findByPk(id);

      if (!zone) {
        return res.status(404).json({ error: 'Zona não encontrada.' });
      }

      await zone.update(req.body);

      return res.json(zone);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar zona.' });
    }
  }

  // 5. DELETAR (DELETE)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const zone = await Zone.findByPk(id);

      if (!zone) {
        return res.status(404).json({ error: 'Zona não encontrada.' });
      }

      await zone.destroy();

      return res.json({ message: 'Zona excluída com sucesso.' });
    } catch (error) {
      // Se tentar apagar uma zona que tem lotes vinculados, o banco trava
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({ 
          error: "Não é possível excluir esta zona pois existem Lotes ou Parâmetros vinculados a ela." 
        });
      }
      return res.status(500).json({ error: 'Erro ao excluir zona.' });
    }
  }
}

export default new ZoneController();