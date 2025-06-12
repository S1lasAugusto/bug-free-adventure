# 🚀 Bug Free Adventure - Sistema de Aprendizado Adaptativo

Uma plataforma moderna de aprendizado personalizada construída com Next.js, tRPC, Prisma e integração com API externa para tracking de progresso em exercícios de programação Java.

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Stack Tecnológica](#-stack-tecnológica)
- [Configuração do Ambiente](#-configuração-do-ambiente)
- [Configuração do Banco de Dados](#-configuração-do-banco-de-dados)
- [Instalação e Execução](#-instalação-e-execução)
- [Deploy no Vercel](#-deploy-no-vercel)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Externa](#-api-externa)

## 🎯 Visão Geral

O **Bug Free Adventure** é uma plataforma de aprendizado que oferece uma experiência personalizada para estudantes de programação Java. O sistema integra com a API externa Adapt/Protus para sincronizar progresso de exercícios e oferece dashboards interativos para acompanhamento do aprendizado.

### Principais Características:

- **Autenticação JWT personalizada** (migrado do NextAuth)
- **Integração com API externa** para tracking de exercícios
- **Dashboard interativo** com gráficos de progresso
- **Sistema de onboarding** personalizado
- **Gestão de tarefas (ToDo)** integrada
- **Sistema de reflexão metacognitiva (Regula)**
- **Leaderboard** para gamificação

## ✨ Funcionalidades

### 🔐 Sistema de Autenticação

- Registro e login com email/senha
- Tokens JWT armazenados no localStorage
- Middleware de proteção de rotas
- Redirecionamento automático para onboarding

### 📚 Gestão de Cursos

- Módulos organizados por curso (Java)
- Exercícios categorizados (Examples, Challenges, Coding)
- Tracking automático de progresso
- Histórico de atividades visitadas e completadas

### 📊 Analytics e Dashboards

- Gráfico de atividades ao longo do tempo
- Estatísticas de progresso
- Cards de status de curso
- Timeline de atividades recentes

### 🎯 Sistema Regula (Metacognição)

- Criação de planos de estudo
- Sub-planos com estratégias personalizadas
- Sistema de reflexões metacognitivas
- Tracking de domínio por tópico

### ✅ Gestão de Tarefas

- Sistema de ToDo integrado
- Datas de vencimento
- Marcação de conclusão
- Ordenação automática por prioridade

## 🛠 Stack Tecnológica

### Frontend

- **Next.js 12.3.1** - Framework React
- **TypeScript** - Tipagem estática
- **TailwindCSS** - Estilização
- **React Hook Form** - Gestão de formulários
- **Chart.js** - Gráficos interativos
- **Lucide React** - Ícones

### Backend

- **tRPC** - API type-safe
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas
- **Zod** - Validação de schemas

### Deploy e Infraestrutura

- **Vercel** - Deploy e hosting
- **Supabase** - PostgreSQL gerenciado
- **GitHub** - Versionamento

## ⚙️ Configuração do Ambiente

### Variáveis de Ambiente Necessárias

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Database URLs (Supabase)
DATABASE_URL="postgresql://postgres.ybdezzbkmikwkgrowwax:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.ybdezzbkmikwkgrowwax:SUA_SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres"

# JWT Secret para autenticação
JWT_SECRET="seu-jwt-secret-super-seguro-aqui"

# NextAuth Secret (legacy)
NEXTAUTH_SECRET="seu-nextauth-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

### 📝 Descrição das Variáveis

| Variável          | Descrição                                      | Exemplo                                                              |
| ----------------- | ---------------------------------------------- | -------------------------------------------------------------------- |
| `DATABASE_URL`    | URL de conexão pooled do Supabase (porta 6543) | postgresql://user:pass@host:6543/db?pgbouncer=true                   |
| `DIRECT_URL`      | URL de conexão direta do Supabase (porta 5432) | postgresql://user:pass@host:5432/db                                  |
| `JWT_SECRET`      | Chave secreta para assinar tokens JWT          | uma-string-aleatoria-muito-segura                                    |
| `NEXTAUTH_SECRET` | Chave para NextAuth (legacy, ainda necessária) | outra-string-aleatoria-segura                                        |
| `NEXTAUTH_URL`    | URL da aplicação                               | http://localhost:3000 (dev) ou https://seu-dominio.vercel.app (prod) |

## 🗄️ Configuração do Banco de Dados

### 1. Criação do Projeto no Supabase

```bash
# 1. Acesse https://supabase.com
# 2. Crie uma nova organização
# 3. Crie um novo projeto
# 4. Defina uma senha para o banco
# 5. Escolha a região (recomendado: us-east-1)
```

### 2. Configuração das URLs de Conexão

O Supabase fornece duas URLs importantes:

- **Pooled Connection (DATABASE_URL)**: Porta 6543 com pgbouncer
- **Direct Connection (DIRECT_URL)**: Porta 5432 para migrações

### 3. Comandos para Configurar o Banco

```bash
# Gerar o cliente Prisma
npx prisma generate

# Sincronizar schema com o banco (cria as tabelas)
npx prisma db push

# Popular o banco com dados iniciais
npm run db:seed

# Visualizar dados no Prisma Studio
npx prisma studio
```

### 4. Estrutura do Banco Criada

O comando `prisma db push` criará as seguintes tabelas:

- **User** - Usuários do sistema
- **UserPreference** - Preferências de usuário
- **ExerciseHistory** - Histórico de exercícios
- **ToDo** - Tarefas dos usuários
- **GeneralPlan** - Planos gerais de estudo
- **SubPlan** - Sub-planos específicos
- **Reflection** - Reflexões metacognitivas
- **Course** - Cursos disponíveis
- **Module** - Módulos dos cursos
- **ActivityResource** - Recursos/exercícios

### 5. População Inicial (Seed)

O comando `npm run db:seed` irá:

```bash
# Popular com dados do curso Java
- Criar curso "Java Programming"
- Criar 14 módulos (arrays, loops, conditionals, etc.)
- Criar 850+ atividades de exemplo, desafios e coding
- Mapear IDs compatíveis com a API externa
```

## 🚀 Instalação e Execução

### 1. Clone o Repositório

```bash
git clone https://github.com/S1lasAugusto/bug-free-adventure.git
cd bug-free-adventure
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure o Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite com suas configurações
nano .env
```

### 4. Configure o Banco de Dados

```bash
# Gere o cliente Prisma
npx prisma generate

# Sincronize o schema
npx prisma db push

# Popule com dados iniciais
npm run db:seed
```

### 5. Execute em Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### 6. Build para Produção

```bash
npm run build
npm start
```

## 🌐 Deploy no Vercel

### 1. Configuração no Vercel

```bash
# 1. Faça push do código para GitHub
git add .
git commit -m "Deploy setup"
git push origin main

# 2. Acesse https://vercel.com
# 3. Importe o repositório do GitHub
# 4. Configure as variáveis de ambiente
```

### 2. Variáveis de Ambiente no Vercel

No painel do Vercel, adicione:

```env
DATABASE_URL=postgresql://postgres.ybdezzbkmikwkgrowwax:SENHA@aws-0-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.ybdezzbkmikwkgrowwax:SENHA@aws-0-us-east-2.pooler.supabase.com:5432/postgres
JWT_SECRET=seu-jwt-secret
NEXTAUTH_SECRET=seu-nextauth-secret
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

### 3. Build Settings

O Vercel detectará automaticamente:

- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Install Command**: `npm install`
- **Output Directory**: `.next`

### 4. Deploy Automático

Após a configuração, cada push para `main` fará deploy automático.

## 📁 Estrutura do Projeto

```
bug-free-adventure/
├── prisma/
│   ├── schema.prisma          # Schema do banco
│   └── seed.ts               # Dados iniciais
├── src/
│   ├── components/           # Componentes React
│   │   ├── regula/          # Sistema Regula
│   │   └── ...
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx  # Contexto de autenticação
│   ├── pages/               # Páginas Next.js
│   │   ├── api/             # API routes
│   │   ├── auth/            # Páginas de autenticação
│   │   └── ...
│   ├── server/              # Configuração do servidor
│   │   ├── api/             # Routers tRPC
│   │   └── schema/          # Schemas Zod
│   ├── styles/              # Estilos CSS
│   └── utils/               # Utilitários
├── .env                     # Variáveis de ambiente
├── package.json            # Dependências
└── README.md              # Este arquivo
```

## 🔌 API Externa

### Integração com Adapt/Protus

O sistema integra com a API externa para sincronizar progresso:

```typescript
// URL da API
const API_URL = "http://adapt2.sis.pitt.edu/aggregate2/GetContentLevels";

// Parâmetros
const params = {
  usr: user.protusId, // ID do usuário no sistema externo
  grp: "NorwaySpring2025A", // Grupo do curso
  mod: "user", // Modo de operação
  sid: "TEST", // Session ID
  cid: "352", // Course ID
  lastActivityId: "while_loops.j_digits",
  res: "-1",
};
```

### Mapeamento de Dados

A API retorna progresso que é mapeado para:

- **Examples** - Exercícios de exemplo
- **Challenges** - Desafios de programação
- **Coding** - Exercícios de código

### Tracking Automático

- **visitedAt**: Definido quando usuário clica em exercício
- **completedAt**: Sincronizado da API externa quando exercício é concluído
- **attempts**: Número de tentativas do usuário

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, envie um email para `seu-email@exemplo.com` ou abra uma issue no GitHub.

---

**Desenvolvido com ❤️ usando T3 Stack**
