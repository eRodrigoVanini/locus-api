import 'dotenv/config'; 

export default {
  dialect: "postgres",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,

  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },

  dialectOptions: {
    timezone: "America/Sao_Paulo",
  },
  timezone: "America/Sao_Paulo",
};
