import * as Yup from "yup";
import User from "../models/User.js";
import File from "../models/File.js";

class UserController {
  async store(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
        email: Yup.string().email().required(),
        password: Yup.string().required().min(6),
        birthdate: Yup.date().required(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Falha na validação dos dados." });
      }

      const { email } = req.body;

      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      const { id, name, birthdate } = await User.create(req.body);

      return res.status(201).json({ id, name, email, birthdate });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno: " + error.message });
    }
  }

  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "birthdate"],
        include: [
          {
            model: File,
            as: "avatar",
            attributes: ["id", "file_name", "url"],
          },
        ],
        order: [["created_at", "DESC"]],
      });

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.userId, {
        attributes: ["id", "name", "email", "birthdate"],
        include: [
          {
            model: File,
            as: "avatar",
            attributes: ["id", "file_name", "url"],
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
    
      const schema = Yup.object().shape({
        name: Yup.string().optional(),
        email: Yup.string().email().optional(),
        oldPassword: Yup.string().min(6).optional(),
        password: Yup.string().min(6).optional(),
        confirmPassword: Yup.string()
          .optional()
          .oneOf([Yup.ref("password")]),
        avatar_id: Yup.string().nullable().optional(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Falha na validação." });
      }

      const { email, oldPassword, password, confirmPassword, avatar_id } =
        req.body;
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

    
      if (password) {
        if (!oldPassword) {
          return res
            .status(400)
            .json({ error: "oldPassword é obrigatório para alterar a senha." });
        }
        if (!(await user.passwordIsValid(oldPassword))) {
          return res.status(401).json({ error: "Senha antiga inválida." });
        }
        if (password !== confirmPassword) {
          return res
            .status(400)
            .json({ error: "confirmPassword deve coincidir com password." });
        }
      }

      
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
          return res.status(400).json({ error: "E-mail já existe." });
        }
      }

      await user.update(req.body);

      
      const { id, name, email: updatedEmail, birthdate } = user;
      return res.json({ id, name, email: updatedEmail, birthdate });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno: " + error.message });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // O banco vai apagar automaticamente todos os Lots, Análises e Arquivos vinculados (se configurado com CASCADE)
      await user.destroy();

      return res.json({
        message: "Sua conta e todos os seus dados foram excluídos com sucesso.",
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

export default new UserController();
