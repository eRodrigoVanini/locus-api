import * as Yup from 'yup';
import Lot from '../models/Lot.js';
import Zone from '../models/Zone.js';

class LotController {
  // 1. CRIAR (STORE)
  async store(req, res) {
    try {
      // Validação
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string(),
        total_area: Yup.number().required(),
        status: Yup.string(), 
        zone_id: Yup.string().uuid().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Dados inválidos ou incompletos.' });
      }

      const { name, description, total_area, status, zone_id } = req.body;

    
      const zoneExists = await Zone.findByPk(zone_id);
      if (!zoneExists) {
        return res.status(400).json({ error: 'A Zona informada não existe.' });
      }

      const lot = await Lot.create({
        name,
        description,
        total_area,
        status,
        zone_id,
   
        user_id: req.userId,
      });

      return res.status(201).json(lot);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar lote.' });
    }
  }


  async index(req, res) {
    try {
      const lots = await Lot.findAll({
        // Traz os dados relacionados
        include: [
          { association: 'owner', attributes: ['id', 'name', 'email'] },
          { association: 'zone', attributes: ['id', 'name', 'acronym'] },
        ],
        order: [['created_at', 'DESC']],
      });
      return res.json(lots);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar lotes.' });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;

      const lot = await Lot.findByPk(id, {
        include: [
          { association: 'owner', attributes: ['id', 'name', 'email'] },
          { association: 'zone', attributes: ['id', 'name', 'acronym', 'description'] },
        ],
      });

      if (!lot) {
        return res.status(404).json({ error: 'Lote não encontrado.' });
      }

      return res.json(lot);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar detalhes do lote.' });
    }
  }


  async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description, total_area, status, zone_id } = req.body;


      const schema = Yup.object().shape({
        name: Yup.string(),
        description: Yup.string(),
        total_area: Yup.number(),
        zone_id: Yup.string().uuid(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: 'Dados inválidos.' });
      }

      const lot = await Lot.findByPk(id);

      if (!lot) {
        return res.status(404).json({ error: 'Lote não encontrado.' });
      }

 
      if (lot.user_id !== req.userId) {
        return res.status(401).json({ error: 'Você não tem permissão para editar este lote.' });
      }

      if (zone_id && zone_id !== lot.zone_id) {
        const zoneExists = await Zone.findByPk(zone_id);
        if (!zoneExists) {
          return res.status(400).json({ error: 'A Zona informada não existe.' });
        }
      }

      await lot.update({
        name,
        description,
        total_area,
        status,
        zone_id,
      });

      const updatedLot = await Lot.findByPk(id, {
        include: [
          { association: 'owner', attributes: ['id', 'name'] },
          { association: 'zone', attributes: ['id', 'name', 'acronym'] },
        ],
      });

      return res.json(updatedLot);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar o lote.' });
    }
  }


  async delete(req, res) {
    try {
      const { id } = req.params;

      const lot = await Lot.findByPk(id);

      if (!lot) {
        return res.status(404).json({ error: 'Lote não encontrado.' });
      }

  
      if (lot.user_id !== req.userId) {
        return res.status(401).json({ error: 'Você não tem permissão para deletar este lote.' });
      }

      await lot.destroy();

      return res.json({ message: 'Lote deletado com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar lote.' });
    }
  }
}

export default new LotController();