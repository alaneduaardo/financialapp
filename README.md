# 💰 Financial Tracker

Dashboard financeiro profissional que lê dados do Google Sheets em tempo real.

## 📋 Funcionalidades

- Dashboard interativo com métricas financeiras
- Visualização de gastos por categoria (gráficos de pizza e barra)
- Alertas automáticos de orçamento
- Comparação de gastos vs orçamento
- Listagem completa de transações
- Integração com Google Sheets

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

Edite `.env.local` e adicione:
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
│   ├── _app.js          # Configuração global do app
│   └── index.js         # Dashboard principal
├── styles/
│   └── globals.css      # Estilos globais
├── docs/                # Documentação
├── .env.local           # Variáveis de ambiente (não commitado)
├── .env.example         # Template de variáveis
└── package.json         # Dependências
```

## 🛠️ Tecnologias

- **Next.js** - Framework React
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos interativos
- **Lucide React** - Ícones
- **Google Sheets API** - Fonte de dados

## 📖 Documentação

- [Guia de Deployment Vercel](docs/GUIDE_DEPLOYMENT_VERCEL.txt)
- [Setup Google API](docs/GOOGLE_API_SETUP.txt)
- [Setup Completo Next.js](docs/setup_nextjs_completo.txt)

## 🔒 Segurança & Privacidade

- Dados armazenados apenas no seu Google Sheet
- API Key visível no frontend (use restrições de domínio no Google Cloud)
- Nenhum servidor backend (100% frontend)

## 📝 Licença

Projeto pessoal - Uso livre
