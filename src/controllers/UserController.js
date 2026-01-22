import * as Yup from "yup";
import User from "../models/User.js";
import File from "../models/File.js";

class UserController {
  // 1. CRIAR (STORE)
  async store(req, res) {
    try {
      // Validação
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
  }

  // 2. LISTAR TODOS (INDEX)
  async index(req, res) {
    try {
      const users = await User.findAll({
        attributes: ["id", "name", "email", "birthdate"], // Protege a senha
       /* include: [
          {
            model: File,
            as: "avatar",
            attributes: ["id", "path", "url"],
          },
        ],
        order: [["created_at", "DESC"]],
      */});

      return res.json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  // 3. MOSTRAR PERFIL LOGADO (SHOW)
  async show(req, res) {
    try {
      // Pega o ID direto do token (req.userId)
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
  }

  async update(req, res) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string(),
        email: Yup.string().email(),
        oldPassword: Yup.string().min(6),
        password: Yup.string()
          .min(6)
          .when("oldPassword", (oldPassword, field) =>
            oldPassword ? field.required() : field,
          ),
        confirmPassword: Yup.string().when("password", (password, field) =>
          password ? field.required().oneOf([Yup.ref("password")]) : field,
        ),
        // Aceita string (UUID) ou null (para remover foto)
        avatar_id: Yup.string().nullable(),
      });

      if (!(await schema.isValid(req.body))) {
        return res.status(400).json({ error: "Falha na validação." });
      }

      const { email, oldPassword, avatar_id } = req.body;

      // 1. Busca o usuário que está logado
      const user = await User.findByPk(req.userId);

      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // --- LÓGICA DE TROCA DE IMAGEM ---
      // Se o usuário enviou um campo 'avatar_id' (seja novo ID ou null)
      // E esse valor é DIFERENTE do que já está salvo...
      if (avatar_id !== undefined && avatar_id !== user.avatar_id) {
        // Se o usuário JÁ TINHA uma foto antes, precisamos apagá-la para não acumular lixo
        if (user.avatar_id) {
          const oldFile = await File.findByPk(user.avatar_id);

          if (oldFile) {
            // A. Apagar o arquivo físico da pasta
            // Caminho: src/controllers -> .. -> .. -> uploads -> avatars -> arquivo
            const filePath = resolve(
              __dirname,
              "..",
              "..",
              "uploads",
              "avatars",
              oldFile.file_name,
            );

            try {
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath); // Deleta o arquivo
              }
            } catch (err) {
              console.log("Erro ao deletar arquivo físico:", err);
            }

            // B. Apagar o registro da tabela 'files'
            await oldFile.destroy();
          }
        }
      }
      // ---------------------------------

      // Validação de email duplicado
      if (email && email !== user.email) {
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
          return res.status(400).json({ error: "E-mail já está em uso." });
        }
      }

      // Validação de senha
      if (oldPassword && !(await user.checkPassword(oldPassword))) {
        return res.status(401).json({ error: "Senha antiga incorreta." });
      }

      // Atualiza os dados (o Sequelize ignora campos undefined)
      await user.update(req.body);

      // Retorna os dados atualizados com o objeto do avatar
      const { id, name, avatar } = await User.findByPk(req.userId, {
        include: [
          {
            model: File,
            as: "avatar",
            attributes: ["id", "file_name", "url"],
          },
        ],
      });

      return res.json({ id, name, email, avatar });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message });
    }
  }

  // 5. DELETAR CONTA (DELETE)
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
