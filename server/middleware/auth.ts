import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.startsWith('/api/admin')) {
    return;
  }

  try {
    const token = getCookie(event, 'auth-token') || getHeader(event, 'authorization')?.replace('Bearer ', '');
    
    if (!token) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Token de acesso não encontrado' };
    }

    const config = useRuntimeConfig();
    const decoded = jwt.verify(token, config.jwtSecret);
    
    event.context.user = decoded;
  } catch (error) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Token inválido' };
  }
});