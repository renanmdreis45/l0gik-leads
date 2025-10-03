export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    return { success: false, error: 'Método não permitido' };
  }

  try {
    deleteCookie(event, 'auth-token');
    return { success: true, message: 'Logout realizado com sucesso' };
  } catch (error: any) {
    console.error('Logout error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
});
