import jwt from 'jsonwebtoken';
import { prisma } from '../../../../lib/prisma';

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticação
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token de acesso requerido' };
    }

    const config = useRuntimeConfig();
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    
    if (!decoded.userId) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token inválido' };
    }

    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = query.search as string || '';
    const offset = (page - 1) * limit;

    const where = search ? {
      OR: [
        { nome: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { telefone: { contains: search } },
        { cargo: { contains: search, mode: 'insensitive' } }
      ]
    } : {};

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.lead.count({ where })
    ]);

    return {
      success: true,
      data: {
        leads,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    };
  } catch (error: any) {
    console.error('List leads error:', error);
    if (error.name === 'JsonWebTokenError') {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token inválido' };
    }
    return { success: false, error: 'Erro interno do servidor' };
  }
});
