// src/app/controllers/UserController.js
import User from "../models/User.js";
import File from "../models/File.js"; // Importamos File, não UserPhoto
import * as Yup from "yup"; // Recomendado para validação

// 1. CRIAR (STORE)
export const store = async (req, res) => {
  try {
    // Validação básica
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      birthdate: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: "Falha na validação." });
    }

    const { email } = req.body;

    // Verifica duplicidade
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    // Criação
    const { id, name, birthdate } = await User.create(req.body);

    return res.status(201).json({ id, name, email, birthdate });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno: " + error.message });
  }
};

// 2. LISTAR TODOS (INDEX)
export const index = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "birthdate"], // Protege a senha
      include: [
        {
          model: File,
          as: "avatar", // Usamos o 'as' definido no Model User
          attributes: ["id", "path", "url"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    return res.json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// 3. MOSTRAR PERFIL LOGADO (SHOW)
// Geralmente queremos ver o NOSSO perfil, não o de um ID qualquer
export const show = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "name", "email", "birthdate"],
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"],
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
};

// 4. ATUALIZAR (UPDATE)
export const updateUser = async (req, res) => {
  try {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Se quiser mudar o email, verifica se já existe
    if (email && email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: "E-mail já está em uso." });
      }
    }

    // Se informou senha antiga, quer trocar a senha
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: "Senha antiga incorreta." });
    }

    // Atualiza (Sequelize ignora campos undefined)
    await user.update(req.body);

    // Retorna os dados atualizados com o Avatar novo (se houver)
    const { id, name, avatar } = await User.findByPk(req.userId, {
      include: [
        {
          model: File,
          as: "avatar",
          attributes: ["id", "path", "url"],
        },
      ],
    });

    return res.json({ id, name, email, avatar });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
