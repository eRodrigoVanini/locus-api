import File from "../models/File.js";


class FileController {
  async store(req, res) {
    // Se não veio arquivo, erro
    if (!req.file) {
      return res.status(400).json({ error: "Arquivo não enviado." });
    }

    const { originalname: name, filename: path } = req.file;

    try {
      // Apenas cria o registro na tabela Files
      const file = await File.create({
        name,
        path,
      });

      return res.json(file);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao salvar arquivo." });
    }
  }
}

export default new FileController();
