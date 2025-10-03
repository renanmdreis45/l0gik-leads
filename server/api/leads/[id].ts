import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

export default defineEventHandler(async (event) => {
  const leadId = parseInt(getRouterParam(event, 'id') as string);
  
  if (!leadId || isNaN(leadId)) {
    setResponseStatus(event, 400);
    return { success: false, error: 'ID do lead inválido' };
  }

  // Verificar autenticação para operações que não são GET
  const method = getMethod(event);
  if (method !== 'GET') {
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token de acesso requerido' };
    }

    try {
      const config = useRuntimeConfig();
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      
      if (!decoded.userId) {
        setResponseStatus(event, 401);
        return { success: false, error: 'Token inválido' };
      }
    } catch (error) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token inválido' };
    }
  }

  try {
    // GET - Buscar lead por ID
    if (method === 'GET') {
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      });

      if (!lead) {
        setResponseStatus(event, 404);
        return { success: false, error: 'Lead não encontrado' };
      }

      return { success: true, data: lead };
    }

    // PUT - Atualizar lead
    if (method === 'PUT') {
      const body = await readBody(event);
      const { nome, email, telefone, cargo, dataNascimento, mensagem } = body;

      const updatedLead = await prisma.lead.update({
        where: { id: leadId },
        data: {
          nome,
          email,
          telefone,
          cargo,
          dataNascimento,
          mensagem: mensagem || ''
        }
      });

      return { 
        success: true, 
        message: 'Lead atualizado com sucesso',
        data: updatedLead 
      };
    }

    // DELETE - Deletar lead
    if (method === 'DELETE') {
      await prisma.lead.delete({
        where: { id: leadId }
      });

      return { 
        success: true, 
        message: 'Lead deletado com sucesso'
      };
    }

    setResponseStatus(event, 405);
    return { success: false, error: 'Método não permitido' };

  } catch (error: any) {
    console.error('Lead operation error:', error);
    
    if (error.code === 'P2025') {
      setResponseStatus(event, 404);
      return { success: false, error: 'Lead não encontrado' };
    }
    
    return { success: false, error: 'Erro interno do servidor' };
  }
});
