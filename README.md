# 💰 Financial Tracker

Dashboard financeiro profissional com autenticação segura (SSR) que lê dados do Google Sheets em tempo real.

## 📋 Funcionalidades

- 🔒 **Sistema de autenticação completo** (usuário e senha)
- 🛡️ **SSR (Server-Side Rendering)** - credenciais protegidas no servidor
- 📊 Dashboard interativo com métricas financeiras
- 📈 Visualização de gastos por categoria (gráficos de pizza e barra)
- ⚠️ Alertas automáticos de orçamento
- 📉 Comparação de gastos vs orçamento
- 📋 Listagem completa de transações
- ☁️ Integração segura com Google Sheets API

## 🚀 Setup Local

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local` e preencha com suas credenciais:

```bash
cp .env.example .env.local
```

Edite `.env.local` e configure:

**Autenticação (Obrigatório):**
- `AUTH_USERNAME`: Seu usuário de login
- `AUTH_PASSWORD`: Sua senha (mínimo 8 caracteres)
- `SESSION_SECRET`: Secret para criptografia (gere com comando abaixo)

```bash
# Gerar SESSION_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Google Sheets (Obrigatório):**
- `NEXT_PUBLIC_GOOGLE_SHEETS_ID`: ID do seu Google Sheet
- `NEXT_PUBLIC_GOOGLE_API_KEY`: Sua API Key do Google Cloud

### 3. Executar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 📊 Configuração do Google Sheets

1. Criar projeto em [Google Cloud Console](https://console.cloud.google.com)
2. Ativar Google Sheets API
3. Criar API Key
4. Partilhar seu Google Sheet como público
5. Adicionar ID e API Key ao `.env.local`

Para instruções detalhadas, consulte [docs/GOOGLE_API_SETUP.txt](docs/GOOGLE_API_SETUP.txt)

## 🌐 Deploy na Vercel

1. Push para GitHub
2. Conectar repositório em [Vercel](https://vercel.com)
3. Adicionar variáveis de ambiente no dashboard da Vercel
4. Deploy automático

Para instruções detalhadas, consulte [docs/GUIDE_DEPLOYMENT_VERCEL.txt](docs/GUIDE_DEPLOYMENT_VERCEL.txt)

## 📁 Estrutura do Projeto

```
financial-tracker/
├── pages/
│   ├── _app.js                    # Configuração global do app
│   ├── index.js                   # Dashboard principal (protegido com SSR)
│   ├── login.js                   # Página de login
│   └── api/
│       ├── auth/
│       │   ├── login.js          # API de autenticação
│       │   ├── logout.js         # API de logout
│       │   └── me.js             # API de verificação de sessão
│       └── sheets/
│           └── transactions.js   # API proxy para Google Sheets (protegido)
├── lib/
│   └── session.js                # Configuração de sessões seguras
├── styles/
│   └── globals.css               # Estilos globais
├── docs/                         # Documentação
│   ├── AUTHENTICATION_GUIDE.txt  # Guia completo de autenticação
│   ├── GOOGLE_API_SETUP.txt      # Setup Google Sheets API
│   └── GUIDE_DEPLOYMENT_VERCEL.txt
├── .env.local                    # Variáveis de ambiente (NUNCA commitar!)
├── .env.example                  # Template de variáveis
└── package.json                  # Dependências
```

## 🛠️ Tecnologias

- **Next.js 14** - Framework React com SSR
- **iron-session** - Sessões seguras com criptografia AES-256
- **Tailwind CSS** - Estilização moderna
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **Google Sheets API** - Fonte de dados

## 📖 Documentação

- [**Guia de Autenticação Completo**](docs/AUTHENTICATION_GUIDE.txt) ⭐ **NOVO**
- [Guia de Deployment Vercel](docs/GUIDE_DEPLOYMENT_VERCEL.txt)
- [Setup Google API](docs/GOOGLE_API_SETUP.txt)
- [Setup Completo Next.js](docs/setup_nextjs_completo.txt)

## 🔒 Segurança & Privacidade

### ✅ Sistema de Autenticação Implementado

- 🔐 **Login obrigatório** com usuário e senha
- 🛡️ **SSR (Server-Side Rendering)** - credenciais NUNCA expostas no frontend
- 🍪 **Sessões seguras** com cookies httpOnly e criptografia AES-256
- 🔑 **Google Sheets API protegida** - todas requisições passam pelo servidor
- ⏰ **Sessões expiram** após 7 dias de inatividade
- 🚫 **Proteção de rotas** - páginas inacessíveis sem autenticação

### Arquitetura de Segurança

1. **Frontend (Cliente):**
   - Nenhuma credencial armazenada
   - Apenas cookies de sessão criptografados
   - Redirecionamento automático para login se não autenticado

2. **Backend (API Routes):**
   - Credenciais do Google Sheets protegidas no servidor
   - Middleware de autenticação em todas as rotas sensíveis
   - Validação de sessão em cada requisição

3. **Dados:**
   - Armazenados apenas no seu Google Sheet
   - Acesso controlado por autenticação
   - Nenhum dado persistido no servidor

## 📝 Licença

Projeto pessoal - Uso livre
