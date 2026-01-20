import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        original_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        file_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        path: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            // Pega a URL do servidor das variáveis de ambiente ou usa localhost como fallback
            const appUrl = process.env.APP_URL
            // Monta a URL final: http://localhost:PORT/files/nome-do-arquivo.jpg
            return `${appUrl}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files', // Garante que o Sequelize procure a tabela 'files'
      }
    );

    return this;
  }
}

export default File;