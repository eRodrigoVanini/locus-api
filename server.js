import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";
import "./src/models/index.js";

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import express from "express";
const app = express();
app.use(express.json());
app.use("/files", express.static(path.resolve(__dirname, "uploads")));
const PORT = process.env.PORT;

import routes from "./src/routes/index.routes.js";

routes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
