import multer from "multer";
import crypto from "crypto";
import { extname, resolve, dirname } from "path";
import { fileURLToPath } from "url";

// Ajuste para __dirname funcionar com ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  storage: multer.diskStorage({
    // Onde salvar (pasta uploads na raiz)
    destination: resolve(__dirname, "..", "..", "uploads", "avatars"),

    // Como nomear (Hash aleatório + extensão original) para não sobrepor arquivos
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        // Exemplo: 'a9s8d7f98as7df.png'
        return cb(null, res.toString("hex") + extname(file.originalname));
      });
    },
  }),
};
