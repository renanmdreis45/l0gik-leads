import { z } from 'zod';

// Regex for Brazilian phone number validation
const brazilianPhoneRegex = /^(?:\+55\s?)?(?:\([1-9]{2}\)\s?)?(?:9\s?)?[0-9]{4}-?[0-9]{4}$/;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const leadSchema = z.object({
  nome: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  
  email: z.string()
    .regex(emailRegex, 'Email deve ter um formato válido')
    .max(255, 'Email deve ter no máximo 255 caracteres'),
  
  telefone: z.string()
    .regex(brazilianPhoneRegex, 'Telefone deve ter um formato brasileiro válido'),
  
  cargo: z.string()
    .min(2, 'Cargo deve ter pelo menos 2 caracteres')
    .max(100, 'Cargo deve ter no máximo 100 caracteres'),
  
  dataNascimento: z.string()
    .refine((date) => {
      const parsed = new Date(date);
      const now = new Date();
      const age = now.getFullYear() - parsed.getFullYear();
      return !isNaN(parsed.getTime()) && age >= 16 && age <= 120;
    }, 'Data de nascimento deve ser válida e a pessoa deve ter entre 16 e 120 anos'),
  
  mensagem: z.string()
    .min(10, 'Mensagem deve ter pelo menos 10 caracteres')
    .max(1000, 'Mensagem deve ter no máximo 1000 caracteres'),
  
  // Optional tracking fields
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
  ip: z.string().optional(),
  userAgent: z.string().optional()
});

export const loginSchema = z.object({
  username: z.string()
    .min(3, 'Usuário deve ter pelo menos 3 caracteres')
    .max(50, 'Usuário deve ter no máximo 50 caracteres'),
  
  password: z.string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .max(100, 'Senha deve ter no máximo 100 caracteres')
});

export const leadUpdateSchema = leadSchema.partial();

export type LeadFormData = z.infer<typeof leadSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type LeadUpdateData = z.infer<typeof leadUpdateSchema>;