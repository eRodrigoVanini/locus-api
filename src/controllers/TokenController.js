import jwt from "jsonwebtoken";
import User from "../models/User.js";
import File from "../models/File.js"; // Importante para trazer o avatar

class TokenController {
  async store(req, res) {
    const { email = "", password = "" } = req.body;

    // 1. Validação básica
    if (!email || !password) {
      return res.status(401).json({ error: "Credenciais inválidas!" });
    }

    // 2. Busca o usuário e INCLUI o Avatar
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: "avatar", // Deve bater com o "as" no seu User.js
          attributes: ["id", "path", "url"],
        },
      ],
    });

    // 3. Verifica se usuário existe
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado!" });
    }

    // 4. Verifica a senha
    if (!(await user.passwordIsValid(password))) {
      return res.status(401).json({ error: "Senha inválida!" });
    }

    const { id, name, avatar } = user;

    // 5. Gera o Token
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    // 6. Retorna tudo que o Frontend precisa
    return res.json({
      user: {
        id,
        name,
        email,
        avatar,
      },
      token,
    });
  }
}

export default new TokenController();
