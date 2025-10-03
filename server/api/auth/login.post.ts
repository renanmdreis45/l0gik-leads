import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Database } from '../../utils/database';

export default defineEventHandler(async (event) => {
  if (getMethod(event) !== 'POST') {
    return { success: false, error: 'Método não permitido' };
  }

  try {
    const body = await readBody(event);
    const { username, password } = body;

    
    if (!username || !password) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Usuário e senha são obrigatórios' };
    }

    
    const user = await Database.getUserByUsername(username);
    if (!user) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Credenciais inválidas' };
    }

    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      setResponseStatus(event, 401);
      return { success: false, error: 'Credenciais inválidas' };
    }

    
    const config = useRuntimeConfig();
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 
    });

    return { 
      success: true, 
      data: { 
        user: { id: user.id, username: user.username },
        token 
      } 
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Erro interno do servidor' };
  }
});