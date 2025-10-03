import { Database } from '../../../utils/database';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const searchTerm = query.search as string;

      if (searchTerm) {
        const leads = await Database.searchLeads(searchTerm);
        return { success: true, data: leads };
      } else {
        const leads = await Database.getLeads();
        return { success: true, data: leads };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar leads' };
    }
  }

  return { success: false, error: 'Método não permitido' };
});