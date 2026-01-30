import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { ArrowUp, ArrowDown, AlertCircle, TrendingUp, Calendar, LogOut } from 'lucide-react';
import { getSession } from '../lib/session';

export default function Dashboard({ user }) {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [budget, setBudget] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonth, setCurrentMonth] = useState('Jan');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Orçamento padrão
  const defaultBudget = {
    'Hipoteca': 910,
    'Empréstimo Carro': 237,
    'Seguros Carro': 35,
    'Utilidades': 155,
    'Phone/Internet': 85,
    'Subscrições': 30,
    'Restauração': 150,
    'Supermercado': 320,
    'Combustível': 120,
    'Transporte': 50,
    'Saúde': 80,
    'Compras Impulso': 100,
    'Condomínio': 50,
    'Transfer Fixa': 870,
    'Pessoal': 30,
    'Outros': 50
  };

  // Carregar dados do servidor (SSR protegido)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Buscar dados da API route (credenciais protegidas no servidor)
        const response = await fetch('/api/sheets/transactions');

        if (!response.ok) {
          throw new Error('Erro ao carregar dados do servidor');
        }

        const data = await response.json();
        setTransactions(data.transactions || []);
        setBudget(defaultBudget);
        setError(null);
      } catch (err) {
        setError(`Erro ao carregar dados: ${err.message}`);
        console.error(err);
        // Usar dados demo se erro
        setTransactions(getDemoData());
        setBudget(defaultBudget);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Função de logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout');
      router.push('/login');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
    }
  };

  // Dados demo para teste
  const getDemoData = () => [
    { Data: '2025-01-05', Descrição: 'McDonald\'s', Valor: '-15.50', Categoria: 'Restauração', Mês: 'Jan' },
    { Data: '2025-01-06', Descrição: 'Continente', Valor: '-45.30', Categoria: 'Supermercado', Mês: 'Jan' },
    { Data: '2025-01-07', Descrição: 'Hipoteca', Valor: '-872.56', Categoria: 'Hipoteca', Mês: 'Jan' },
    { Data: '2025-01-08', Descrição: 'Cofidis', Valor: '-231.21', Categoria: 'Empréstimo Carro', Mês: 'Jan' },
    { Data: '2025-01-27', Descrição: 'Salário', Valor: '3425.02', Categoria: 'Salário', Mês: 'Jan' },
  ];

  // Calcular gastos por categoria
  const calculateByCategory = () => {
    const filtered = transactions.filter(t => t.Mês === currentMonth);
    const byCategory = {};

    filtered.forEach(t => {
      const cat = t.Categoria?.trim() || 'Outros';
      const value = parseFloat(t.Valor) || 0;
      byCategory[cat] = (byCategory[cat] || 0) + value;
    });

    return byCategory;
  };

  // Calcular totais
  const calculateTotals = () => {
    const filtered = transactions.filter(t => t.Mês === currentMonth);
    let income = 0, expense = 0;

    filtered.forEach(t => {
      const value = parseFloat(t.Valor) || 0;
      if (value > 0) income += value;
      else expense += Math.abs(value);
    });

    return { income, expense, balance: income - expense };
  };

  // Gerar alertas
  const generateAlerts = () => {
    const byCategory = calculateByCategory();
    const alerts = [];

    Object.entries(byCategory).forEach(([cat, spent]) => {
      const limit = budget[cat] || 0;
      const absSpent = Math.abs(spent);
      
      if (cat !== 'Salário' && cat !== 'Transfer Fixa' && limit > 0) {
        if (absSpent > limit * 1.2) {
          alerts.push({ type: 'danger', cat, spent: absSpent, limit, percentage: (absSpent / limit * 100).toFixed(0) });
        } else if (absSpent > limit * 0.8) {
          alerts.push({ type: 'warning', cat, spent: absSpent, limit, percentage: (absSpent / limit * 100).toFixed(0) });
        }
      }
    });

    return alerts.sort((a, b) => b.percentage - a.percentage);
  };

  const byCategory = calculateByCategory();
  const totals = calculateTotals();
  const alerts = generateAlerts();

  // Dados para gráficos
  const pieData = Object.entries(byCategory)
    .filter(([cat]) => cat !== 'Salário' && byCategory[cat] < 0)
    .map(([cat, value]) => ({ name: cat, value: Math.abs(value) }))
    .sort((a, b) => b.value - a.value);

  const barData = Object.entries(byCategory)
    .filter(([cat]) => cat !== 'Salário' && cat !== 'Transfer Fixa')
    .map(([cat, value]) => ({
      category: cat,
      spent: Math.abs(value),
      budget: budget[cat] || 0
    }))
    .sort((a, b) => b.spent - a.spent)
    .slice(0, 8);

  const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a', '#fee140'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">💰 Financial Tracker</h1>
              <p className="text-slate-600 mt-1">Alan Eduardo - Controlo de Gastos</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-600">🔒 Sessão segura</p>
                <p className="text-xs text-slate-500 mt-1">Usuário: {user?.username}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-800">{error}</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'transactions', label: '📋 Transações', icon: '📋' },
            { id: 'settings', label: '⚙️ Configuração', icon: '⚙️' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Seletor de Mês */}
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-4">
              <Calendar className="w-5 h-5 text-slate-600" />
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <span className="text-sm text-slate-600 ml-auto">{transactions.filter(t => t.Mês === currentMonth).length} transações</span>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Entrada</p>
                    <p className="text-3xl font-bold text-green-600">€{totals.income.toFixed(2)}</p>
                  </div>
                  <ArrowUp className="w-8 h-8 text-green-500 opacity-20" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Saída</p>
                    <p className="text-3xl font-bold text-red-600">€{totals.expense.toFixed(2)}</p>
                  </div>
                  <ArrowDown className="w-8 h-8 text-red-500 opacity-20" />
                </div>
              </div>

              <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${totals.balance >= 0 ? 'border-blue-500' : 'border-orange-500'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-600 text-sm font-medium mb-2">Saldo</p>
                    <p className={`text-3xl font-bold ${totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                      €{totals.balance.toFixed(2)}
                    </p>
                  </div>
                  <TrendingUp className={`w-8 h-8 opacity-20 ${totals.balance >= 0 ? 'text-blue-500' : 'text-orange-500'}`} />
                </div>
              </div>
            </div>

            {/* Alertas */}
            {alerts.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Alertas de Orçamento
                </h2>
                <div className="space-y-3">
                  {alerts.map((alert, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg ${
                        alert.type === 'danger'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-slate-900">{alert.cat}</span>
                        <span className={`text-sm font-bold ${alert.type === 'danger' ? 'text-red-600' : 'text-yellow-600'}`}>
                          {alert.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${alert.type === 'danger' ? 'bg-red-500' : 'bg-yellow-500'}`}
                          style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-slate-600 mt-2">
                        €{alert.spent.toFixed(2)} de €{alert.limit.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pieData.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Distribuição de Gastos</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: €${value.toFixed(0)}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}

              {barData.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Gasto vs Orçamento</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData} margin={{ bottom: 60, left: 0, right: 0, top: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
                      <Legend />
                      <Bar dataKey="spent" fill="#667eea" name="Gasto Real" radius={[8, 8, 0, 0]} />
                      <Bar dataKey="budget" fill="#d1d5db" name="Orçamento" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Tabela Resumo */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">Resumo por Categoria</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-3 text-left font-medium text-slate-700">Categoria</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-700">Gasto</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-700">Orçamento</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-700">%</th>
                      <th className="px-6 py-3 text-right font-medium text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(byCategory)
                      .filter(([cat]) => cat !== 'Salário')
                      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
                      .map(([cat, value], idx) => {
                        const absValue = Math.abs(value);
                        const budgetValue = budget[cat] || 0;
                        const percentage = budgetValue > 0 ? (absValue / budgetValue * 100).toFixed(0) : 0;
                        const isOver = absValue > budgetValue && budgetValue > 0;
                        
                        return (
                          <tr key={cat} className={`border-b border-slate-100 ${isOver ? 'bg-red-50' : idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                            <td className="px-6 py-4 font-medium text-slate-900">{cat}</td>
                            <td className="px-6 py-4 text-right text-slate-600">€{absValue.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right text-slate-600">€{budgetValue.toFixed(2)}</td>
                            <td className="px-6 py-4 text-right font-medium text-slate-900">{percentage}%</td>
                            <td className="px-6 py-4 text-right">
                              {budgetValue === 0 ? (
                                <span className="text-slate-400 text-xs">—</span>
                              ) : isOver ? (
                                <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">❌ Excessivo</span>
                              ) : (
                                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">✅ OK</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-slate-900">Transações - {currentMonth}</h2>
              <p className="text-sm text-slate-600 mt-1">{transactions.filter(t => t.Mês === currentMonth).length} transações neste mês</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-3 text-left font-medium text-slate-700">Data</th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">Descrição</th>
                    <th className="px-6 py-3 text-left font-medium text-slate-700">Categoria</th>
                    <th className="px-6 py-3 text-right font-medium text-slate-700">Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions
                    .filter(t => t.Mês === currentMonth)
                    .sort((a, b) => new Date(b.Data) - new Date(a.Data))
                    .map((t, idx) => {
                      const value = parseFloat(t.Valor) || 0;
                      return (
                        <tr key={idx} className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <td className="px-6 py-4 text-slate-600">{t.Data}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{t.Descrição}</td>
                          <td className="px-6 py-4 text-slate-600">{t.Categoria}</td>
                          <td className={`px-6 py-4 text-right font-medium ${value > 0 ? 'text-green-600' : 'text-slate-900'}`}>
                            {value > 0 ? '+' : ''}€{value.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <h2 className="text-lg font-bold text-slate-900 mb-4">🔒 Segurança e Configuração</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-900 mb-2">✅ Credenciais Protegidas</h3>
                  <p className="text-sm text-green-800">
                    As credenciais do Google Sheets estão armazenadas de forma segura no servidor (SSR).
                    Nenhuma informação sensível é exposta no frontend.
                  </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-blue-900 mb-2">🛡️ Autenticação Ativa</h3>
                  <p className="text-sm text-blue-800 mb-2">
                    Você está autenticado como: <strong>{user?.username}</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    Todas as requisições são protegidas por sessão segura com cookies httpOnly.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <h3 className="font-semibold text-slate-900 mb-2">⚙️ Configuração do Servidor</h3>
                  <p className="text-sm text-slate-700 mb-2">
                    Para atualizar credenciais do Google Sheets, edite o arquivo <code className="bg-slate-200 px-2 py-1 rounded">.env.local</code> no servidor:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>NEXT_PUBLIC_GOOGLE_SHEETS_ID</li>
                    <li>NEXT_PUBLIC_GOOGLE_API_KEY</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-bold text-blue-900 mb-2">📚 Configuração do Google Sheets</h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Cria novo projeto em console.cloud.google.com</li>
                <li>Ativa a API "Google Sheets API"</li>
                <li>Cria uma chave de API (API Key)</li>
                <li>Partilha o teu Google Sheet como "Público"</li>
                <li>Adiciona credenciais no arquivo .env.local do servidor</li>
                <li>Reinicia a aplicação para aplicar mudanças</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Informações de Segurança</h3>
              <ul className="text-sm text-yellow-800 space-y-2 list-disc list-inside">
                <li>Credenciais NUNCA são expostas no frontend</li>
                <li>Todas as requisições passam por autenticação</li>
                <li>Sessões expiram após 7 dias de inatividade</li>
                <li>Use senhas fortes para acesso à aplicação</li>
              </ul>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Proteger página com autenticação SSR
export async function getServerSideProps({ req, res }) {
  const session = await getSession(req, res);

  // Se não estiver autenticado, redirecionar para login
  if (!session.user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // Passar dados do usuário para o componente
  return {
    props: {
      user: session.user,
    },
  };
}
