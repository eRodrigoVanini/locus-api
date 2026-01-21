import File from "../models/File.js";

class FileController {
  async store(req, res) {
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado." });
    }

    // Desestruturação simples
    const { originalname, filename } = req.file;

    try {
      const file = await File.create({
        original_name: originalname, 
        file_name: filename,        
      });

      return res.json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao salvar arquivo." });
    }
  }
}

export default new FileController();