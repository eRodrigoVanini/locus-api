import * as Yup from "yup";
import UseType from "../models/UseType.js";

class UseTypeController {
  // 1. CRIAR (STORE)
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("O nome é obrigatório"),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Validação falhou." });
      }

      const { name } = req.body;

      // Verifica se já existe (Evita duplicados como "Residencial" e "residencial")
      const useTypeExists = await UseType.findOne({ where: { name } });

      if (useTypeExists) {
        return res.status(400).json({ error: "Este Tipo de Uso já existe." });
      }

      const useType = await UseType.create({ name });

      return res.status(201).json(useType);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno ao criar." });
    }
  }

  // 2. LISTAR TODOS (INDEX)
  async index(req, res) {
    try {
      const useTypes = await UseType.findAll({
        order: [["name", "ASC"]], // De A a Z fica mais fácil de ler no Select
        attributes: ["id", "name"],
      });
      return res.json(useTypes);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao listar." });
    }
  }

  // 3. MOSTRAR UM
  async show(req, res) {
    try {
      const { id } = req.params;

      const useType = await UseType.findByPk(id);

      if (!useType) {
        return res.status(404).json({ error: "Tipo de Uso não encontrado." });
      }

      return res.json(useType);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar detalhe." });
    }
  }

  // 4. ATUALIZAR
  async update(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      // Validação básica
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "O nome é obrigatório." });
      }

      const useType = await UseType.findByPk(id);

      if (!useType) {
        return res.status(404).json({ error: "Tipo de Uso não encontrado." });
      }

      // Se o usuário mudou o nome, verifica se o NOVO nome já não está em uso por outra pessoa
      if (name && name !== useType.name) {
        const useTypeExists = await UseType.findOne({ where: { name } });
        if (useTypeExists) {
          return res
            .status(400)
            .json({ error: "Já existe outro Tipo de Uso com este nome." });
        }
      }

      await useType.update({ name });

      return res.json(useType);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao atualizar." });
    }
  }

  // 5. DELETAR (DELETE)
  async delete(req, res) {
    try {
      const { id } = req.params;

      const useType = await UseType.findByPk(id);

      if (!useType) {
        return res.status(404).json({ error: "Tipo de Uso não encontrado." });
      }

      await useType.destroy();

      return res.json({ message: "Tipo de Uso deletado com sucesso." });
    } catch (error) {
      // Se tentar apagar algo que está sendo usado numa Zona, o banco bloqueia
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          error:
            "Não é possível apagar este item pois existem Parâmetros Urbanísticos vinculados a ele.",
        });
      }
      return res.status(500).json({ error: "Erro interno ao deletar." });
    }
  }
}

export default new UseTypeController();
