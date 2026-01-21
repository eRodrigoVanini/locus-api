import Sequelize, { Model } from "sequelize";

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
        },
        // ---------------------------------

        original_name: Sequelize.STRING,
        file_name: Sequelize.STRING,

        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3000/files/avatars/${this.file_name}`;
          },
        },
      },
      {
        sequelize,
      },
    );

    return this;
  }
}

export default File;
