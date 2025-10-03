import { Database } from '../../utils/database';

export default defineEventHandler(async (event) => {
  const leadId = getRouterParam(event, 'id');
  const method = getMethod(event);

  if (!leadId) {
    return { success: false, error: 'ID do lead é obrigatório' };
  }

  if (method === 'GET') {
    try {
      const lead = await Database.getLeadById(leadId);
      if (!lead) {
        setResponseStatus(event, 404);
        return { success: false, error: 'Lead não encontrado' };
      }
      return { success: true, data: lead };
    } catch (error) {
      return { success: false, error: 'Erro ao buscar lead' };
    }
  }

  if (method === 'PUT') {
    try {
      const body = await readBody(event);
      const updatedLead = await Database.updateLead(leadId, body);
      
      if (!updatedLead) {
        setResponseStatus(event, 404);
        return { success: false, error: 'Lead não encontrado' };
      }
      
      return { success: true, data: updatedLead };
    } catch (error) {
      return { success: false, error: 'Erro ao atualizar lead' };
    }
  }

  if (method === 'DELETE') {
    try {
      const deleted = await Database.deleteLead(leadId);
      
      if (!deleted) {
        setResponseStatus(event, 404);
        return { success: false, error: 'Lead não encontrado' };
      }
      
      return { success: true, message: 'Lead deletado com sucesso' };
    } catch (error) {
      return { success: false, error: 'Erro ao deletar lead' };
    }
  }

  return { success: false, error: 'Método não permitido' };
});