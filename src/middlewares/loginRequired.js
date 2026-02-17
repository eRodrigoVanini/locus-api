
import jwt from "jsonwebtoken";
import { promisify } from "util"; 

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Login necessário!" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.TOKEN_SECRET,
    );
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    return next();
  } catch (err) {
    return res.status(401).json({ error: "Login inválido." });
  }
};
