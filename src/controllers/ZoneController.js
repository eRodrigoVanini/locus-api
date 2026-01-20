import * as Yup from "yup";
import Zone from "../models/Zone.js";
import City from "../models/City.js";
import UrbanParameter from "../models/UrbanParameter.js";
import UseType from "../models/UseType.js";

// LISTAR ZONAS (Opcionalmente filtrando por cidade)
export const getAllZones = async (req, res) => {
  try {
    const { city_id } = req.query;
    const where = city_id ? { city_id } : {};

    const zones = await Zone.findAll({
      where,
      include: [{ model: City, as: "city", attributes: ["name", "state"] }],
      order: [["name", "ASC"]],
    });

    return res.json(zones);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar zonas." });
  }
};

// MOSTRAR DETALHES (Trazendo os parâmetros urbanos dessa zona)
export const getZoneDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const zone = await Zone.findByPk(id, {
      include: [
        { model: City, as: "city" },
        {
          model: UrbanParameter,
          as: "parameters", // Nome definido no associate do model Zone
          include: [{ model: UseType, as: "use_type", attributes: ["name"] }],
        },
      ],
    });

    if (!zone) {
      return res.status(404).json({ error: "Zona não encontrada." });
    }

    return res.json(zone);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar detalhes da zona." });
  }
};

// CRIAR ZONA (Geralmente usado por administradores)
export const createZone = async (req, res) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      acronym: Yup.string().required(),
      description: Yup.string().required(),
      city_id: Yup.string().uuid().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Dados inválidos." });
    }

    const zone = await Zone.create(req.body);
    return res.status(201).json(zone);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar zona." });
  }
};
