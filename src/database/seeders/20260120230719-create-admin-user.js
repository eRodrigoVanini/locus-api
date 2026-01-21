import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default {
  async up(queryInterface) {
    // 1. Gerar o hash da senha manualmente (já que o Seeder pula os Hooks do Model)
    const passwordHash = await bcrypt.hash('123456', 8);

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(), 
        name: 'Administrador Locus',
        email: 'admin@locus.com.br',
        password_hash: passwordHash, 
        birthdate: new Date('1990-01-01'), 
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: uuidv4(),
        name: 'Usuário Comum',
        email: 'user@teste.com',
        password_hash: passwordHash,
        birthdate: new Date('1995-05-20'),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
  },
};