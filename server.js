import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import "./src/models/index.js";
import cors from "cors";

// [SECURITY] Importando proteções
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
const app = express();

// [SECURITY] Adiciona cabeçalhos de segurança HTTP
app.use(helmet());

// [SECURITY] Configura limite de taxa para requisições
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Muitas requisições deste IP, tente novamente mais tarde.",
});
app.use(limiter);

app.use(express.json());
app.use(cors());
app.use("/files", express.static(path.resolve(__dirname, "uploads")));
const PORT = process.env.PORT;

import routes from "./src/routes/index.routes.js";

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
