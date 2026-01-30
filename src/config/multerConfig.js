import multer from "multer";
import crypto from "crypto";
import { extname, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  storage: multer.diskStorage({
    destination: resolve(__dirname, "..", "..", "uploads", "avatars"),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);
        return cb(null, res.toString("hex") + extname(file.originalname));
      });
    },
  }),
  // [SECURITY] Filtro para garantir que apenas imagens sejam enviadas
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images are allowed."));
    }
  },
  // [SECURITY] Limite de tamanho (2MB)
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};
