# L0gik Leads

Sistema completo de gerenciamento de leads com interface administrativa e formulário público de captura.

## 📱 Screenshots

### Dashboard Administrativo
![Painel Administrativo](./assets/admin-dashboard.png)
*Dashboard administrativo com estatísticas e gerenciamento completo de leads*

### Formulário de Novo Lead
![Novo Lead](./assets/novo-lead-form.png)
*Interface para criação de novos leads com formulário completo*

## 🚀 Tecnologias Utilizadas

### Frontend
- **Nuxt 4** - Framework Vue.js full-stack
- **Vue 3** - Framework reativo para interface
- **Tailwind CSS** - Framework CSS utilitário
- **Pinia** - Gerenciamento de estado

### Backend & Database
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação baseada em tokens
- **bcryptjs** - Criptografia de senhas

### Bibliotecas Auxiliares
- **ExcelJS** - Exportação de dados para Excel/CSV
- **Zod** - Validação de esquemas TypeScript

## 📋 Pré-requisitos

- Node.js 18+ 
- PostgreSQL
- npm ou yarn

## ⚙️ Configuração

### 1. Clone o repositório
```bash
git clone <repository-url>
cd l0gik-leads
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/l0gik_leads"
JWT_SECRET="seu-jwt-secret-super-seguro"
```

### 4. Configure o banco de dados
```bash
# Gerar o cliente Prisma
npx prisma generate

# Executar migrações
npx prisma db push

# (Opcional) Popular com dados de exemplo
npx prisma db seed
```

## 🎯 Como Executar

### Desenvolvimento
```bash
# Opção 1: Servidor Nuxt (recomendado para desenvolvimento)
npm run dev

# Opção 2: Servidor Express (caso necessário)
node server-express.mjs
```
O servidor estará disponível em `http://localhost:3000`

### Produção
```bash
# Build da aplicação
npm run build

# Executar versão de produção
npm run preview
```

## 📱 Funcionalidades

### Área Pública
- **Formulário de Captura** (`/form`) - Coleta dados de leads
- Interface responsiva e otimizada para conversão

### Área Administrativa (`/admin`)
- **Login Seguro** - Autenticação JWT
- **Dashboard** - Estatísticas e visão geral
- **Gerenciamento de Leads**:
  - Listagem com busca e filtros
  - Visualização detalhada
  - Edição de informações
  - Criação de novos leads
  - Exportação para Excel/CSV

### Credenciais Padrão
- **Usuário**: `admin`
- **Senha**: `admin123`

## 🏗️ Estrutura do Projeto

```
├── app/
│   ├── pages/          # Páginas da aplicação
│   │   ├── form.vue    # Formulário público
│   │   └── admin/      # Área administrativa
│   ├── composables/    # Lógica reutilizável
│   └── middleware/     # Middlewares de autenticação
├── server/
│   └── api/            # API endpoints
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
└── utils/              # Utilitários compartilhados
```

## ⚡ Conceitos Técnicos Aplicados

### Arquitetura Full-Stack
- **SSR/SPA Híbrido**: Nuxt combina renderização server-side com funcionalidades SPA
- **API Routes**: Endpoints serverless integrados no Nuxt
- **Middleware**: Proteção de rotas e validação de autenticação

### Segurança
- **JWT Tokens**: Autenticação stateless com tokens seguros
- **Hash de Senhas**: bcryptjs para criptografia de senhas
- **Validação de Dados**: Zod para validação rigorosa de esquemas

### Performance
- **Lazy Loading**: Componentes carregados sob demanda
- **Otimização de Bundle**: Nuxt otimiza automaticamente o código
- **Caching**: Estratégias de cache para melhor performance

### UX/UI
- **Design Responsivo**: Interface adaptável a diferentes dispositivos
- **Feedback Visual**: Loading states e mensagens de erro/sucesso
- **Navegação Intuitiva**: Fluxo de usuário otimizado

### Banco de Dados
- **ORM Moderno**: Prisma para type-safety e produtividade
- **Migrações**: Controle de versão do schema
- **Relacionamentos**: Estrutura relacional bem definida

## 🔧 Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run preview` - Preview da build
- `npm run generate` - Geração estática
- `npx prisma studio` - Interface visual do banco

## 📊 Exportação de Dados

O sistema oferece exportação completa dos leads em formatos:
- **CSV** - Para análise em planilhas
- **Excel** - Com formatação avançada

## 🚀 Deploy

O projeto está otimizado para deploy em:
- **Netlify** (recomendado)
- **Vercel**
- **Servidores VPS**

Certifique-se de configurar as variáveis de ambiente na plataforma de deploy.

---

**Desenvolvido com ❤️ usando as melhores práticas de desenvolvimento web moderno.**