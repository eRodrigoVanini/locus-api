import Sequelize, { Model } from "sequelize";
import bcrypt from "bcryptjs";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "",
          validate: {
            len: {
              args: [3, 255],
              msg: "O campo nome deve ter entre 3 e 255 caracteres.",
            },
          },
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
          validate: {
            isEmail: {
              msg: "Email inválido.",
            },
          },
        },
        birthdate: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        avatar_id: {
          type: Sequelize.UUID, // Importante: UUID para bater com a tabela Files
          references: { model: "files", key: "id" },
          allowNull: true,
        },
        password_hash: {
          type: Sequelize.STRING,
        },
        password: {
          type: Sequelize.VIRTUAL,
          defaultValue: "",
          validate: {
            len: {
              args: [6, 20],
              msg: "A senha deve ter entre 6 e 20 caracteres.",
            },
          },
        },
      },
      { sequelize },
    );

    this.addHook("beforeSave", async (user) => {
      if (user.password) {
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });
    return this;
  }
static associate(models) {
  this.belongsTo(models.File, { foreignKey: 'avatar_id', as: 'avatar' });
}

  passwordIsValid(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default User;
