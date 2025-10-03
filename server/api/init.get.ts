import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' }
    });
    
    if (existingAdmin) {
      return { 
        success: true, 
        message: 'Sistema já inicializado',
        adminExists: true 
      };
    }

    const passwordHash = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash
      }
    });

    return { 
      success: true, 
      message: 'Sistema inicializado com sucesso',
      adminCreated: true,
      credentials: {
        username: 'admin',
        password: 'admin123'
      }
    };
  } catch (error: any) {
    console.error('Init error:', error);
    return { success: false, error: 'Erro ao inicializar sistema' };
  }
});