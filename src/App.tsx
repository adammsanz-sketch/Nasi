import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  Settings,
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  Activity,
  Menu,
  X,
  Plus,
  Trash2,
  Download
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? (value as any)(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// --- MOCK DATA ---
const initialTransactions = [
  { id: 'TRX-15', description: 'Income', type: 'income', category: 'Bisnes', date: '2026-05-01', amount: 150.00 },
  { id: 'TRX-13', description: 'Income tambah', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 210.00 },
  { id: 'TRX-11', description: 'Income (50+400)', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 450.00 },
  { id: 'TRX-10', description: 'Medical keluar', type: 'expense', category: 'Health', date: '2026-04-30', amount: 200.00 },
  { id: 'TRX-9', description: 'Keluar 500', type: 'expense', category: 'Bisnes', date: '2026-04-30', amount: 500.00 },
  { id: 'TRX-8', description: 'Botak hutang', type: 'hutang_customer', person: 'Botak', category: 'Hutang', date: '2026-04-30', amount: 180.00 },
  { id: 'TRX-7', description: 'Botak beli - tunai', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 140.00 },
  { id: 'TRX-6', description: 'Income tambah', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 30.00 },
  { id: 'TRX-5', description: 'Customer beli tunai (300+450+440+30)', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 1220.00 },
  { id: 'TRX-4', description: 'Customer kecik hutang tinggal (470-300-120)', type: 'hutang_customer', person: 'Kecik', category: 'Hutang', date: '2026-04-30', amount: 50.00 },
  { id: 'TRX-3', description: 'Customer bayar hutang', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 120.00 },
  { id: 'TRX-2', description: 'Customer beli - tunai dapat', type: 'income', category: 'Bisnes', date: '2026-04-30', amount: 300.00 },
  { id: 'TRX-1', description: 'Modal keluar bisnes', type: 'expense', category: 'Bisnes', date: '2026-04-29', amount: 6900.00 }
];

const initialInventory: any[] = [];
const initialCustomers: any[] = [];
const initialDebts: any[] = [];

const CHART_COLORS = [
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Emerald', hex: '#10b981' },
  { name: 'Rose', hex: '#f43f5e' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Purple', hex: '#8b5cf6' },
];

// --- COMPONENTS ---
const Sidebar = ({ isSidebarOpen, setSidebarOpen, activeTab, setActiveTab }: { isSidebarOpen: boolean, setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>, activeTab: string, setActiveTab: (tab: string) => void }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'DASHBOARD' },
    { id: 'transactions', icon: ShoppingCart, label: 'BUKU TUNAI (TRANSAKSI)' },
    { id: 'hutang', icon: CreditCard, label: 'SENARAI ORANG HUTANG' },
    { id: 'inventory', icon: Package, label: 'INVENTORY' },
    { id: 'analytics', icon: TrendingUp, label: 'ANALYTICS' },
    { id: 'customers', icon: Users, label: 'CUSTOMERS' },
  ];

  return (
    <>
      <div className={`fixed inset-0 bg-slate-900/50 z-20 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setSidebarOpen(false)} />
      <div className={`fixed inset-y-0 left-0 w-52 bg-slate-900 z-30 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:block flex flex-col shrink-0`}>
        <div className="p-4 flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center font-bold text-white text-sm">
            <Package className="h-5 w-5" />
          </div>
          <span className="text-white font-bold tracking-tight uppercase text-sm">NAS FINANCE</span>
        </div>
        <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
             <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`flex items-center gap-3 w-full px-3 py-2 text-xs font-medium rounded transition-colors ${
                activeTab === item.id 
                  ? 'bg-slate-800 text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
             >
               <item.icon className="h-4 w-4" />
               {item.label}
             </button>
          ))}
        </nav>
        <div className="mt-auto p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User avatar" className="w-8 h-8 rounded bg-slate-700 object-cover" />
            <div className="overflow-hidden flex-1 text-left">
              <span className="block text-xs text-white truncate font-medium">Adam Sanz</span>
              <span className="block text-[10px] text-slate-500 uppercase tracking-widest">Admin Role</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const KPICard = ({ title, value, icon: Icon, trend, trendValue, isPositive }: any) => {
  const trendColor = isPositive ? 'text-emerald-600' : 'text-rose-600';
  const barColor = isPositive ? 'bg-blue-500' : 'bg-rose-500';
  return (
    <div className="bg-white p-4 rounded border border-slate-200 shadow-sm flex flex-col justify-between">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">{title}</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-slate-900">{value}</span>
            <span className={`text-[10px] font-bold ${trendColor}`}>
              {trendValue}
            </span>
          </div>
        </div>
        <div className="hidden sm:flex h-8 w-8 rounded bg-slate-50 items-center justify-center border border-slate-100 shrink-0">
          <Icon className="h-4 w-4 text-slate-400" />
        </div>
      </div>
      <div className="w-full bg-slate-100 h-1 mt-auto rounded overflow-hidden">
        <div className={`${barColor} h-full`} style={{ width: isPositive ? '75%' : '38%' }}></div>
      </div>
    </div>
  );
};

export default function App() {
  const [transactions, setTransactions] = useLocalStorage('dashcart_transactions_v5', initialTransactions);
  const [inventory, setInventory] = useLocalStorage('dashcart_inventory_v5', initialInventory);
  const [customers, setCustomers] = useLocalStorage('dashcart_customers_v5', initialCustomers);
  const [debts, setDebts] = useLocalStorage('dashcart_debts_v5', initialDebts);

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [chartColor, setChartColor] = useState(CHART_COLORS[0].hex);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isRestockModalOpen, setRestockModalOpen] = useState(false);
  const [isAddCustomerModalOpen, setAddCustomerModalOpen] = useState(false);
  const [isAddDebtModalOpen, setAddDebtModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setAddTransactionModalOpen] = useState(false);

  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((trx: any) => {
    const matchStatus = statusFilter === 'All' || trx.type === statusFilter;
    const trxDate = new Date(trx.date);
    const start = dateRange.start ? new Date(dateRange.start) : null;
    const end = dateRange.end ? new Date(dateRange.end) : null;
    
    let matchDate = true;
    if (start && trxDate < start) matchDate = false;
    if (end && trxDate > end) matchDate = false;

    const matchSearch = !searchQuery || trx.description.toLowerCase().includes(searchQuery.toLowerCase()) || trx.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchDate && matchSearch;
  });

  const totalIncome = transactions.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
  const totalExpense = transactions.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
  const netBalance = totalIncome - totalExpense;
  const isProfit = netBalance >= 0;
  const formattedNet = (isProfit ? 'RM ' : '-RM ') + Math.abs(netBalance).toLocaleString('en-MY', {minimumFractionDigits: 2});

  // Calculate dynamic chart data
  const dates = [...new Set(transactions.map((t: any) => t.date))].sort() as string[];
  const dynamicRevenueData = dates.map(date => {
    const dayTrxs = transactions.filter((t: any) => t.date === date);
    const dayIncome = dayTrxs.filter((t: any) => t.type === 'income').reduce((sum: number, t: any) => sum + t.amount, 0);
    const dayExpense = dayTrxs.filter((t: any) => t.type === 'expense').reduce((sum: number, t: any) => sum + t.amount, 0);
    
    // Format date string for display (e.g. "05/01")
    const displayDate = typeof date === 'string' && date.includes('-') ? `${date.split('-')[2]}/${date.split('-')[1]}` : date;
    
    return { 
      name: displayDate, 
      income: dayIncome, 
      expense: dayExpense, 
      net: dayIncome - dayExpense 
    };
  });

  const categories = [...new Set(transactions.filter((t: any) => t.type === 'expense').map((t: any) => t.category))].sort() as string[];
  const dynamicSalesData = categories.map(cat => {
    const catTrxs = transactions.filter((t: any) => t.category === cat && t.type === 'expense');
    return {
      name: cat,
      expense: catTrxs.reduce((sum: number, t: any) => sum + t.amount, 0)
    };
  }).sort((a, b) => b.expense - a.expense).slice(0, 7); // Top 7 expense categories

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans text-slate-900 overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden p-1.5 -ml-1.5 rounded text-slate-500 hover:bg-slate-100"
              >
                <Menu className="h-4 w-4" />
             </button>
             <div>
               <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">
                 {activeTab === 'dashboard' ? 'Commercial Overview' : 
                  activeTab === 'transactions' ? 'Buku Tunai (Transaksi)' :
                  activeTab === 'inventory' ? 'Inventory Control' :
                  activeTab === 'analytics' ? 'Analytics Dashboard' :
                  activeTab === 'customers' ? 'Customer Directory' :
                  'Senarai Penghutang & Pemiutang'}
               </h1>
               <p className="text-[10px] text-slate-500 uppercase tracking-widest hidden sm:block font-bold mt-0.5">
                 {activeTab === 'dashboard' ? 'Operational performance overview' :
                  activeTab === 'transactions' ? 'Catat aliran keluar masuk wang' :
                  activeTab === 'inventory' ? 'Stock and product management' :
                  activeTab === 'analytics' ? 'Insights and trends' :
                  activeTab === 'customers' ? 'View and manage customer details' :
                  'Track siapa berhutang dengan perniagaan ini'}
               </p>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex relative group">
              <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 pr-3 py-1.5 w-48 bg-slate-100 border border-transparent rounded text-[10px] font-medium focus:bg-white focus:border-slate-300 outline-none transition-all placeholder:text-slate-500 placeholder:uppercase"
              />
            </div>

            <div className="hidden sm:flex bg-white rounded border border-slate-200 p-1 items-center">
              <button className="px-3 py-1 text-[10px] font-bold bg-slate-100 rounded border border-slate-300 text-slate-700">LAST 30 DAYS</button>
              <button className="px-3 py-1 text-[10px] font-medium text-slate-500 uppercase">Custom</button>
            </div>

            <button className="hidden sm:block bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider hover:bg-blue-700">
              Export Data
            </button>
            
            <button className="relative p-1.5 rounded text-slate-500 hover:bg-slate-100 transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-rose-500 border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
          {(activeTab === 'dashboard' || activeTab === 'analytics') && (
            <div className="flex justify-end items-center -mt-2 mb-2">
              <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Chart Color</span>
                <div className="flex items-center gap-2">
                  {CHART_COLORS.map(color => (
                    <button
                      key={color.hex}
                      onClick={() => setChartColor(color.hex)}
                      className={`w-3.5 h-3.5 rounded-full border border-slate-200 transition-all ${
                        chartColor === color.hex ? 'ring-2 ring-slate-900 border-white scale-110' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={`Set chart color to ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard 
                title="Untung / Rugi Bersih" 
              value={formattedNet} 
              icon={DollarSign} 
              trend={isProfit ? "Untung bersih" : "Belum balik modal"} 
              trendValue={isProfit ? "Profit" : "Loss"} 
              isPositive={isProfit} 
            />
            <KPICard 
              title="Jumlah Pendapatan" 
              value={`RM ${totalIncome.toLocaleString('en-MY', {minimumFractionDigits: 2})}`} 
              icon={TrendingUp} 
              trend="Jualan & byrn hutang" 
              trendValue="Income" 
              isPositive={true} 
            />
            <KPICard 
             title="Jumlah Pengeluaran" 
             value={`RM ${totalExpense.toLocaleString('en-MY', {minimumFractionDigits: 2})}`} 
             icon={TrendingDown} 
             trend="Modal stok & belanja" 
             trendValue="Expense" 
             isPositive={false} 
            />
            <KPICard 
              title="Jumlah Transaksi" 
              value={transactions.length.toString()} 
              icon={Activity} 
              trend="Semua rekod dicatat" 
              trendValue="Logs" 
              isPositive={true} 
            />
          </div>
          )}

          {(activeTab === 'dashboard' || activeTab === 'analytics') && (
            <div className={`grid grid-cols-1 ${activeTab === 'dashboard' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-4`}>
              {/* Revenue Area Chart */}
            <div className="lg:col-span-2 bg-white rounded flex flex-col border border-slate-200 p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Trend Pendapatan Bersih</h3>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dynamicRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                        <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }} tickFormatter={(value) => `RM${value}`} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', fontSize: '10px', padding: '4px 8px' }}
                      labelStyle={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      formatter={(value: any, name: string) => [`RM${value}`, name.toUpperCase()]}
                    />
                    <Area type="monotone" name="Net Profit" dataKey="net" stroke={chartColor} strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Weekly Sales Bar Chart */}
            <div className="bg-white border border-slate-200 rounded p-4 flex flex-col shadow-sm">
              <div className="mb-4 flex flex-col items-start gap-1">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Perbelanjaan Mengikut Kategori</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase">7 Kategori Terbesar</span>
              </div>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dynamicSalesData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600, fontFamily: 'monospace' }} tickFormatter={(value) => `RM${value}`} />
                    <Tooltip 
                      cursor={{ fill: '#f8fafc' }}
                      contentStyle={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)', fontSize: '10px', padding: '4px 8px' }}
                      labelStyle={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase' }}
                      itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                      formatter={(value: any) => [`RM${value}`, 'Perbelanjaan']}
                    />
                    <Bar dataKey="expense" fill="#ef4444" radius={[2, 2, 0, 0]} barSize={16} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          )}

          {(activeTab === 'dashboard' || activeTab === 'transactions') && (
          <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Buku Tunai / Transaksi Terkini</h3>
                {activeTab === 'transactions' && (
                  <button 
                    onClick={() => setAddTransactionModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors rounded shadow-sm inline-flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Catat Transaksi
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Cari transaksi..." 
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded text-[10px] uppercase font-bold focus:bg-white focus:border-blue-500 outline-none w-32 sm:w-40 transition-colors placeholder:text-slate-400"
                  />
                </div>
                
                <select 
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded text-[10px] px-2 py-1 focus:border-blue-500 outline-none uppercase font-bold tracking-wider text-slate-600"
                >
                  <option value="All">Semua Jenis</option>
                  <option value="income">Pemasukan (Income)</option>
                  <option value="expense">Pengeluaran (Expense)</option>
                  <option value="hutang_customer">Hutang / Piutang</option>
                </select>

                <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hidden sm:inline">Bulan:</span>
                  <input 
                    type="month"
                    onChange={e => {
                      if (e.target.value) {
                        const year = e.target.value.split('-')[0];
                        const month = e.target.value.split('-')[1];
                        const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
                        setDateRange({ start: `${e.target.value}-01`, end: `${e.target.value}-${lastDay}` });
                      } else {
                        setDateRange({ start: '', end: '' });
                      }
                    }}
                    className="bg-transparent text-[10px] py-1 focus:outline-none text-slate-600 uppercase font-bold"
                  />
                  <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">From</span>
                    <input 
                      type="date"
                      value={dateRange.start}
                      onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="bg-transparent text-[10px] py-1 focus:outline-none text-slate-600 uppercase font-bold"
                    />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">To</span>
                    <input 
                      type="date"
                      value={dateRange.end}
                      onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="bg-transparent text-[10px] py-1 focus:outline-none text-slate-600 uppercase font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
                    const csvContent = "data:text/csv;charset=utf-8," 
                      + headers.join(',') + '\n' 
                      + filteredTransactions.map((t: any) => `${t.date},${t.type},"${t.category}","${t.description}",${t.amount}`).join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement("a");
                    link.setAttribute("href", encodedUri);
                    link.setAttribute("download", `buku_tunai_${new Date().toISOString().split('T')[0]}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 px-3 py-1 rounded text-[10px] uppercase font-bold flex items-center gap-1 transition-colors"
                >
                  <Download className="h-3 w-3" /> Export CSV
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kategori</th>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Jenis</th>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Amount (RM)</th>
                    <th scope="col" className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length > 0 ? filteredTransactions.map((trx: any, idx: number) => (
                    <tr 
                      key={trx.id} 
                      className={`text-xs ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-slate-50 transition-colors`}
                    >
                      <td className="px-4 py-2.5 font-mono text-slate-900 font-medium">
                        {trx.date}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-xs">
                        {trx.description}
                      </td>
                      <td className="px-4 py-2.5 text-slate-500 font-medium">
                        {trx.category}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${
                          trx.type === 'income' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          trx.type === 'expense' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {trx.type === 'income' ? 'Income' : trx.type === 'expense' ? 'Expense' : 'Hutang'}
                        </span>
                      </td>
                      <td className={`px-4 py-2.5 font-mono font-bold text-right ${
                        trx.type === 'income' ? 'text-emerald-600' : 
                        trx.type === 'expense' ? 'text-rose-600' : 'text-amber-600'
                      }`}>
                        {trx.type === 'income' ? '+ RM ' : trx.type === 'expense' ? '- RM ' : 'RM '}
                        {trx.amount.toLocaleString('en-MY', {minimumFractionDigits: 2})}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <button 
                          onClick={() => {
                            if (window.confirm('Padam transaksi ini?')) {
                              setTransactions(transactions.filter((t: any) => t.id !== trx.id));
                            }
                          }}
                          className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-colors inline-block"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500 text-xs shadow-inner bg-slate-50/50">
                        No transactions match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          )}

          {activeTab === 'inventory' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm">
                 <div>
                   <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Inventory Items</h2>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Manage stock and restocks</p>
                 </div>
                 <button 
                   onClick={() => setRestockModalOpen(true)}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm"
                 >
                   + Catat Pengeluaran Restock
                 </button>
               </div>

               <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                       <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Item Name</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Stock</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {inventory.map((item: any, idx: number) => (
                         <tr key={item.id} className={`text-xs ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
                            <td className="px-4 py-2.5 font-medium text-slate-900">{item.name}</td>
                            <td className="px-4 py-2.5 font-mono text-right text-slate-900">{item.stock}</td>
                            <td className="px-4 py-2.5">
                               <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide ${
                                 item.stock > 10 ? 'bg-emerald-100 text-emerald-700' :
                                 item.stock > 0 ? 'bg-amber-100 text-amber-700' :
                                 'bg-rose-100 text-rose-700'
                               }`}>{item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}</span>
                            </td>
                            <td className="px-4 py-2.5 text-right">
                              <button 
                                onClick={() => {
                                  if (window.confirm('Padam inventori ini?')) {
                                    setInventory(inventory.filter((i: any) => i.id !== item.id));
                                  }
                                }}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-colors inline-block"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                         </tr>
                         ))}
                       </tbody>
                    </table>
                  </div>
               </div>
             </div>
          )}

          {/* Restock Modal */}
          {isRestockModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setRestockModalOpen(false)}>
              <div className="bg-white rounded border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Catat Pengeluaran Restock</h3>
                  <button 
                    className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/50 transition-colors" 
                    onClick={() => setRestockModalOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const item = (form.elements.namedItem('item') as HTMLInputElement).value;
                  const qty = parseInt((form.elements.namedItem('qty') as HTMLInputElement).value);
                  const cost = parseFloat((form.elements.namedItem('cost') as HTMLInputElement).value);
                  const vendor = (form.elements.namedItem('vendor') as HTMLInputElement).value;
                  
                  // Update inventory
                  const existingItem = inventory.find((i: any) => i.name.toLowerCase() === item.toLowerCase());
                  if (existingItem) {
                    setInventory(inventory.map((i: any) => i.id === existingItem.id ? { ...i, stock: i.stock + qty } : i));
                  } else {
                    setInventory([{ id: 'INV-' + Date.now(), name: item, stock: qty, status: 'In Stock' }, ...inventory]);
                  }
                  
                  // Add Transaction immediately as Expense Modal (Buku Tunai)
                  if (cost > 0) {
                    setTransactions([{ 
                      id: 'TRX-' + Date.now(), 
                      description: `Beli Stock: ${item} (${qty} unit)`, 
                      type: 'expense', 
                      category: 'Bisnes', 
                      date: new Date().toISOString().split('T')[0], 
                      amount: cost 
                    }, ...transactions]);
                  }

                  // Add Debt if vendor/cost
                  if (vendor && cost) {
                    setDebts([{ id: 'DBT-' + Date.now(), vendor, amount: cost, dueDate: new Date().toISOString().split('T')[0], status: 'Unpaid' }, ...debts]);
                  }

                  setRestockModalOpen(false);
                }}>
                  <div className="p-5 space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Barang</label>
                      <input name="item" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Contoh: Mechanical Keyboard" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah (Qty)</label>
                        <input name="qty" required min="1" type="number" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Total Biaya (Modal)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">$</span>
                          <input name="cost" required min="0" step="0.01" type="number" className="w-full bg-slate-50 border border-slate-200 rounded pl-7 pr-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500" placeholder="0.00" />
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Pemasok / Vendor</label>
                      <input name="vendor" required type="text" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" placeholder="Contoh: Tech Supply Co." />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
                    <button 
                      type="button"
                      className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                      onClick={() => setRestockModalOpen(false)}
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider hover:bg-blue-700 transition-colors"
                    >
                      Simpan Pengeluaran
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm">
                 <div>
                   <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Customer Directory</h2>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Manage your customers</p>
                 </div>
                 <button 
                   onClick={() => setAddCustomerModalOpen(true)}
                   className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shadow-sm inline-flex items-center gap-1"
                 >
                   <Plus className="h-3.5 w-3.5" /> Thmabh Customer
                 </button>
               </div>

               <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                       <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Name</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">No. Telefon</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Orders</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total Spent</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Tindakan</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {customers.map((customer: any, idx: number) => (
                         <tr key={customer.id} className={`text-xs ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'}`}>
                            <td className="px-4 py-2.5 font-medium text-slate-900">{customer.name}</td>
                            <td className="px-4 py-2.5 text-slate-500">{customer.phone || customer.email || '-'}</td>
                            <td className="px-4 py-2.5 font-mono text-right text-slate-900">{customer.orders}</td>
                            <td className="px-4 py-2.5 font-mono font-bold text-right text-slate-900">${customer.totalSpent.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-right">
                              <button 
                                onClick={() => {
                                  if (window.confirm('Padam pelanggan ini?')) {
                                    setCustomers(customers.filter((c: any) => c.id !== customer.id));
                                  }
                                }}
                                className="p-1 hover:bg-rose-50 hover:text-rose-600 text-slate-400 rounded transition-colors inline-block"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                         </tr>
                         ))}
                       </tbody>
                    </table>
                  </div>
               </div>
             </div>
          )}

          {activeTab === 'hutang' && (
             <div className="space-y-4">
               <div className="flex justify-between items-center bg-white p-4 rounded border border-slate-200 shadow-sm">
                 <div>
                   <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Senarai Penghutang</h2>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Senarai orang berhutang dengan perniagaan</p>
                 </div>
               </div>

               <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                       <thead className="bg-slate-50 border-b border-slate-200">
                         <tr>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Orang/Syarikat</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Keterangan</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tarikh</th>
                            <th className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Amaun Hutang</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                         {transactions.filter((t: any) => t.type === 'hutang_customer').map((trx: any, idx: number) => (
                         <tr key={trx.id} className={`text-xs ${idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'} hover:bg-slate-50 transition-colors`}>
                            <td className="px-4 py-2.5 font-medium text-slate-900">{trx.person || '-'}</td>
                            <td className="px-4 py-2.5 text-slate-900">{trx.description}</td>
                            <td className="px-4 py-2.5 font-mono text-slate-500">{trx.date}</td>
                            <td className="px-4 py-2.5 font-mono font-bold text-right text-amber-600">RM {trx.amount.toLocaleString('en-MY', {minimumFractionDigits: 2})}</td>
                         </tr>
                         ))}
                         {transactions.filter((t: any) => t.type === 'hutang_customer').length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 text-xs">Tiada rekod hutang terkini.</td></tr>
                         )}
                       </tbody>
                    </table>
                  </div>
               </div>
             </div>
          )}
        </main>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Order Details</h3>
              <button 
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/50 transition-colors" 
                onClick={() => setSelectedOrder(null)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            
            <div className="p-5 space-y-6">
              {/* Header Info */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-mono font-bold text-slate-900 uppercase">{selectedOrder.id}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{selectedOrder.date}</p>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                  selectedOrder.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                  selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              {/* Customer & Shipping Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer</p>
                   <p className="font-medium text-slate-900 text-xs">{selectedOrder.customer}</p>
                   <p className="text-[10px] text-slate-500 mt-0.5">{selectedOrder.email}</p>
                </div>
                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment & Shipping</p>
                   <p className="text-xs text-slate-900">{selectedOrder.paymentMethod}</p>
                   <p className="text-[10px] text-slate-500 mt-0.5 truncate" title={selectedOrder.shippingAddress}>{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* Items List */}
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Order Items</p>
                <div className="border border-slate-200 rounded divide-y divide-slate-100">
                  {selectedOrder.items?.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                           <Package className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-mono font-bold text-slate-900">${item.price.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Total amounts */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Amount</p>
                 <p className="text-lg font-mono font-bold text-slate-900">${selectedOrder.amount.toFixed(2)}</p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button 
                className="bg-white border border-slate-300 text-slate-700 px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-slate-50 transition-colors"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
              <button 
                className="bg-blue-600 text-white px-4 py-1.5 rounded text-[10px] font-bold shadow-sm uppercase tracking-wider hover:bg-blue-700 transition-colors"
                onClick={() => setSelectedOrder(null)}
              >
                View Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setAddCustomerModalOpen(false)}>
          <div className="bg-white rounded border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add New Customer</h3>
              <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setAddCustomerModalOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const name = (form.elements.namedItem('name') as HTMLInputElement).value;
              const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
              setCustomers([{ id: 'CUS-' + Date.now(), name, phone, orders: 0, totalSpent: 0 }, ...customers]);
              setAddCustomerModalOpen(false);
            }}>
              <div className="p-5 space-y-4">
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</label><input name="name" required className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">No. Telefon</label><input name="phone" type="tel" required className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
              </div>
              <div className="bg-slate-50 p-4 border-t flex justify-end gap-3"><button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Add Debt Modal */}
      {isAddDebtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setAddDebtModalOpen(false)}>
          <div className="bg-white rounded border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Add New Debt</h3>
              <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setAddDebtModalOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const vendor = (form.elements.namedItem('vendor') as HTMLInputElement).value;
              const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
              const dueDate = (form.elements.namedItem('dueDate') as HTMLInputElement).value;
              setDebts([{ id: 'DBT-' + Date.now(), vendor, amount, dueDate, status: 'Unpaid' }, ...debts]);
              setAddDebtModalOpen(false);
            }}>
              <div className="p-5 space-y-4">
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Vendor</label><input name="vendor" required className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Amount</label><input name="amount" type="number" step="0.01" required className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Due Date</label><input name="dueDate" type="date" required className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
              </div>
              <div className="bg-slate-50 p-4 border-t flex justify-end gap-3"><button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm">Save</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {isAddTransactionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setAddTransactionModalOpen(false)}>
          <div className="bg-white rounded border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Catat Transaksi Baru</h3>
              <button className="text-slate-400 hover:text-slate-600 p-1" onClick={() => setAddTransactionModalOpen(false)}><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const date = (form.elements.namedItem('date') as HTMLInputElement).value;
              const description = (form.elements.namedItem('description') as HTMLInputElement).value;
              const category = (form.elements.namedItem('category') as HTMLInputElement).value;
              const type = (form.elements.namedItem('type') as HTMLInputElement).value;
              const person = (form.elements.namedItem('person') as HTMLInputElement)?.value || '';
              const amount = parseFloat((form.elements.namedItem('amount') as HTMLInputElement).value);
              
              setTransactions([{ id: 'TRX-' + Date.now(), description, type, category, date, amount, person }, ...transactions]);
              setAddTransactionModalOpen(false);
            }}>
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Tarikh</label><input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jenis</label>
                    <select name="type" id="trx-type-select" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" onChange={(e) => {
                      const personGroup = document.getElementById('person-input-group');
                      if (personGroup) {
                        personGroup.style.display = e.target.value === 'hutang_customer' ? 'block' : 'none';
                      }
                    }}>
                      <option value="income">Pemasukan (Income)</option>
                      <option value="expense">Pengeluaran Modai/Kos (Expense)</option>
                      <option value="hutang_customer">Hutang Customer (Receivable)</option>
                    </select>
                  </div>
                </div>
                <div id="person-input-group" style={{ display: 'none' }}><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Penghutang</label><input name="person" placeholder="Contoh: Ali, Syarikat ABC" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Keterangan / Description</label><input name="description" required placeholder="Contoh: Customer beli tunai" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori</label><input name="category" required placeholder="Contoh: Bisnes, Hutang, Health" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500" /></div>
                <div><label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jumlah (RM)</label><input name="amount" type="number" step="0.01" min="0" required placeholder="0.00" className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-mono" /></div>
              </div>
              <div className="bg-slate-50 p-4 border-t flex justify-end gap-3"><button type="submit" className="bg-blue-600 text-white px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wider shadow-sm hover:bg-blue-700">Simpan Transaksi</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
