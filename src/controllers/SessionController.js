// src/app/controllers/SessionController.js
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import File from '../../models/File.js'; // Importar para retornar a foto

class SessionController {
  async store(req, res) {
    const { email = '', password = '' } = req.body;

    if (!email || !password) {
      return res.status(401).json({ error: 'Credenciais inválidas!' });
    }

    // Busca o usuário e JÁ INCLUI o avatar para retornar ao front
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado!' });
    }

    // Usando o método que criamos no Model User.js
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Senha inválida!' });
    }

    const { id, name, avatar } = user;

    // Gerar o Token
    const token = jwt.sign({ id, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION, // ex: '7d'
    });

    // Retorna o Usuário (sem a hash da senha) e o Token
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

export default new SessionController();