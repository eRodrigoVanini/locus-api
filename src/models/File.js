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
          unique: true, // Evita nomes de arquivo duplicados no disco
        },
        // CAMPO VIRTUAL: Existe só aqui no código, não vai pro banco
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            const url = process.env.APP_URL;
            return `${url}/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        tableName: 'files',
      }
    );

    return this;
  }
}

export default File;