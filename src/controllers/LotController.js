import Lot from "../models/Lot.js";
import Zone from "../models/Zone.js";
import User from "../models/User.js";

// CRIAR
export const store = async (req, res) => {
  try {
    const { name, description, total_area, status, zone_id } = req.body;

    // Validação básica manual
    if (!name || !total_area || !zone_id) {
      return res.status(400).json({ error: "Dados obrigatórios faltando." });
    }

    const lot = await Lot.create({
      name,
      description,
      total_area,
      status,
      zone_id,
      // SEGURANÇA: O ID vem do Token, não do corpo da requisição
      user_id: req.userId,
    });

    return res.status(201).json(lot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar lote." });
  }
};

// LISTAR TODOS (Com dados do Dono e da Zona)
export const index = async (req, res) => {
  try {
    const lots = await Lot.findAll({
      // Traz os dados relacionados para o front-end não receber só IDs soltos
      include: [
        { association: "owner", attributes: ["id", "name", "email"] },
        { association: "zone", attributes: ["id", "name", "acronym"] },
      ],
    });
    return res.status(200).json(lots);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar lotes." });
  }
};

// ... imports existentes (Lot, Zone, User)

// SHOW: Buscar um único lote pelo ID
export const getLot = async (req, res) => {
  try {
    const { id } = req.params;

    const lot = await Lot.findByPk(id, {
      include: [
        {
          association: "owner",
          attributes: ["id", "name", "email"],
        },
        {
          association: "zone",
          attributes: ["id", "name", "acronym", "description"],
        },
      ],
    });

    if (!lot) {
      return res.status(404).json({ error: "Lote não encontrado." });
    }

    return res.status(200).json(lot);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar detalhes do lote." });
  }
};

// UPDATE: Atualizar dados do lote
export const updateLot = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, total_area, status, zone_id } = req.body;

    const lot = await Lot.findByPk(id);

    if (!lot) {
      return res.status(404).json({ error: "Lote não encontrado." });
    }

    // SEGURANÇA: Só o dono pode editar
    if (lot.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para editar este lote." });
    }

    // Validação de consistência: Se trocou a zona, verifique se a nova existe
    if (zone_id && zone_id !== lot.zone_id) {
      const zoneExists = await Zone.findByPk(zone_id);
      if (!zoneExists) {
        return res.status(400).json({ error: "A Zona informada não existe." });
      }
    }

    // Atualiza apenas os campos permitidos
    await lot.update({
      name,
      description,
      total_area,
      status,
      zone_id,
    });

    // Recarrega o lote com as associações para devolver o objeto completo atualizado
    const updatedLot = await Lot.findByPk(id, {
      include: [
        { association: "owner", attributes: ["id", "name"] },
        { association: "zone", attributes: ["id", "name", "acronym"] },
      ],
    });

    return res.status(200).json(updatedLot);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao atualizar o lote." });
  }
};

// DELETAR (Com verificação de dono)
export const deleteLot = async (req, res) => {
  try {
    const { id } = req.params;

    const lot = await Lot.findByPk(id);

    if (!lot) {
      return res.status(404).json({ error: "Lote não encontrado." });
    }

    // SEGURANÇA: Verifica se quem quer deletar é o dono
    if (lot.user_id !== req.userId) {
      return res
        .status(401)
        .json({ error: "Você não tem permissão para deletar este lote." });
    }

    await lot.destroy();

    return res.status(200).json({ message: "Lote deletado com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar lote." });
  }
};
