export interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  dataNascimento: string;
  mensagem: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
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