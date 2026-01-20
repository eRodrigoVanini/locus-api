// src/app/middlewares/auth.js (ou loginRequired.js)
import jwt from 'jsonwebtoken';
import { promisify } from 'util'; // Ajuda a usar async/await no jwt.verify

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  // O header vem como: "Bearer eyJhbGciOiJIUzI1Ni..."
  // O split quebra no espaço. Pegar a segunda parte (o token).
  const [, token] = authHeader.split(' ');

  try {
    // Decodifica o token
    const decoded = await promisify(jwt.verify)(token, process.env.TOKEN_SECRET);

    // Coloca o ID do usuário dentro da requisição.
    // Assim, todos os Controllers que rodarem DEPOIS desse middleware
    // saberão quem é o usuário logado acessando `req.userId`.
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido.' });
  }
};