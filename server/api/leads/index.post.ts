export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const query = getQuery(event);
      const searchTerm = query.search as string;

      if (searchTerm) {
        
        return { success: true, data: [] };
      } else {
        
        return { success: true, data: [] };
      }
    } catch (error) {
      return { success: false, error: 'Erro ao buscar leads' };
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      
      
      if (!body.nome || !body.email || !body.telefone || !body.cargo || !body.dataNascimento || !body.mensagem) {
        return { 
          success: false, 
          error: 'Campos obrigatórios não preenchidos' 
        };
      }

      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return { 
          success: false, 
          error: 'Email inválido' 
        };
      }

      
      const newLead = {
        id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      
      
      
      return { success: true, data: newLead };
    } catch (error: any) {
      return { success: false, error: 'Erro ao criar lead' };
    }
  }

  return { success: false, error: 'Método não permitido' };
});