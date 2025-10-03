// Database schema for leads management system
export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
  // Tracking fields
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  // Metadata
  createdAt: string;
  updatedAt: string;
  ip?: string;
  userAgent?: string;
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  createdAt: string;
}

export interface DatabaseSchema {
  leads: Lead[];
  users: User[];
}