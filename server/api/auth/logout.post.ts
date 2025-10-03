export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    return { success: false, error: 'Método não permitido' };
  }

  
  deleteCookie(event, 'auth-token');

  return { success: true, message: 'Logout realizado com sucesso' };
});