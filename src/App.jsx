import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Plus, Minus, ArrowLeft, Home, ChefHat, Package, BarChart3, LogOut, Check, Search, X, Sparkles, Store, Settings, User, Trash2, Edit3, Save, Camera, Upload, Image as ImageIcon, Printer, AlertCircle, Phone } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURAÇÃO
// ============================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const PRODUTOS_PADRAO = [
  { id: 1, nome: 'X-Burger', preco: 15, categoria: 'Lanches', imagem: '🍔', descricao: 'Pão, hambúrguer, queijo', disponivel: true },
  { id: 2, nome: 'X-Bacon', preco: 18, categoria: 'Lanches', imagem: '🥓', descricao: 'Pão, hambúrguer, bacon', disponivel: true },
  { id: 3, nome: 'X-Salada', preco: 16, categoria: 'Lanches', imagem: '🥗', descricao: 'Pão, hambúrguer, salada', disponivel: true },
  { id: 4, nome: 'Coca-Cola', preco: 5, categoria: 'Bebidas', imagem: '🥤', descricao: 'Lata 350ml', disponivel: true },
  { id: 5, nome: 'Guaraná', preco: 5, categoria: 'Bebidas', imagem: '🥤', descricao: 'Lata 350ml', disponivel: true },
  { id: 6, nome: 'Batata Frita', preco: 10, categoria: 'Acompanhamentos', imagem: '🍟', descricao: 'Porção média', disponivel: true },
];

const CATEGORIAS = ['Lanches', 'Bebidas', 'Acompanhamentos', 'Sobremesas', 'Combos'];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export default function App() {
  const [tela, setTela] = useState('home');
  const [tenant, setTenant] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [pedido, setPedido] = useState(null);
  const [printQueue, setPrintQueue] = useState([]);

  useEffect(() => { carregarTenants(); }, []);

  useEffect(() => {
    if (tenants.length === 0) return;
    const slug = new URLSearchParams(window.location.search).get('s');
    if (slug) {
      const t = tenants.find(x => x.slug === slug);
      if (t) { setTenant(t); setTela('cardapio'); }
    }
  }, [tenants]);

  const carregarTenants = async () => {
    const { data } = await supabase.from('tenants').select('*');
    setTenants(data || []);
  };

  const addCarrinho = (p) => {
    const existente = carrinho.find(i => i.id === p.id);
    if (existente) {
      setCarrinho(carrinho.map(i => i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i));
    } else {
      setCarrinho([...carrinho, { ...p, qtd: 1 }]);
    }
  };

  const attQtd = (id, delta) => {
    setCarrinho(carrinho.map(i => i.id === id ? { ...i, qtd: Math.max(0, i.qtd + delta) } : i).filter(i => i.qtd > 0));
  };

  const totalCarrinho = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);

  if (tela === 'home') return <TelaHome setTela={setTela} tenants={tenants} />;
  if (tela === 'cadastro') return <TelaCadastro setTela={setTela} setTenant={setTenant} setTenants={setTenants} />;
  if (tela === 'login') return <TelaLogin setTela={setTela} tenants={tenants} setTenant={setTenant} />;
  if (tela === 'cardapio' && tenant) return <TelaCardapio tenant={tenant} carrinho={carrinho} addCarrinho={addCarrinho} setTela={setTela} />;
  if (tela === 'carrinho') return <TelaCarrinho carrinho={carrinho} attQtd={attQtd} total={totalCarrinho} setTela={setTela} tenant={tenant} setPedido={setPedido} limpar={() => setCarrinho([])} />;
  if (tela === 'pedido' && pedido) return <TelaPedido pedido={pedido} tenant={tenant} setTela={setTela} />;
  if (tela === 'admin' && tenant) return <TelaAdmin tenant={tenant} setTenant={setTenant} setTela={setTela} printQueue={printQueue} setPrintQueue={setPrintQueue} />;
  return <TelaHome setTela={setTela} tenants={tenants} />;
}

// ============================================
// TELAS (Home, Cadastro, Login, Cardapio, Carrinho, Pedido)
// ============================================
function TelaHome({ setTela, tenants }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-md shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-lg mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl">⚡</span>
              <span className="text-3xl">🍔</span>
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
              Pedido Rápido
            </h1>
          </div>
          <button onClick={() => setTela('login')} className="text-sm font-bold text-gray-500 hover:text-orange-600 transition-colors flex items-center gap-1">
            <Settings size={16} /> Admin
          </button>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <p className="text-gray-500 font-medium mb-2">Cardápio digital para lanchonetes</p>
        </div>

        <div className="space-y-4 mb-10">
          <button onClick={() => setTela('login')} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg group">
            <Store size={22} className="group-hover:scale-110 transition-transform" />
            Acessar minha loja
          </button>
          <button onClick={() => setTela('cadastro')} className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg group">
            <Sparkles size={22} className="group-hover:scale-110 transition-transform" />
            Começar grátis (7 dias)
          </button>
        </div>

        {tenants.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 border border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">Lojas Recentes</h3>
            <div className="space-y-3">
              {tenants.slice(0, 3).map(t => (
                <div key={t.id} onClick={() => window.location.search = `?s=${t.slug}`} 
                     className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-white rounded-2xl cursor-pointer hover:from-orange-100 hover:to-orange-50 transition-all border border-orange-100 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
                    🏪
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-900 text-lg">{t.name}</p>
                    <p className="text-xs text-gray-500 font-mono truncate">{window.location.origin}/?s={t.slug}</p>
                  </div>
                  <ArrowLeft size={20} className="text-gray-400 rotate-180" />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function TelaCadastro({ setTela, setTenant, setTenants }) {
  const [form, setForm] = useState({ nome: '', slug: '', whatsapp: '', senha: '' });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nome || !form.slug || !form.whatsapp || !form.senha) {
      alert('Preencha todos os campos'); return;
    }
    setLoading(true);
    const slug = form.slug.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase.from('tenants').insert([{
      slug, name: form.nome, whatsapp: form.whatsapp.replace(/\D/g, ''), password: form.senha
    }]).select().single();
    setLoading(false);
    if (error) { alert('Erro: ' + error.message); return; }
    setTenant(data);
    setTenants(prev => [...prev, data]);
    setTela('cardapio');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <header className="bg-white/80 backdrop-blur-md border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => setTela('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="text-gray-500 font-medium">Voltar</span>
      </header>

      <main className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl shadow-green-500/30">
            🎉
          </div>
          <h1 className="text-2xl font-black text-gray-900">Comece Grátis</h1>
          <p className="text-gray-500 text-sm mt-1">7 dias • Sem cartão</p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome da lanchonete *</label>
            <input className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none" 
                   value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Burger Prime"/>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp (5585999999999) *</label>
            <input className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none" 
                   value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="5585999999999"/>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Senha de admin *</label>
            <input type="password" className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none" 
                   value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} placeholder="••••••"/>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Identificador único *</label>
            <input className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none font-mono" 
                   value={form.slug} onChange={e => setForm({...form, slug: e.target.value})} placeholder="meu-negocio"/>
            <p className="text-xs text-gray-400 mt-2">
              Link: <span className="text-gray-500">{window.location.origin}/</span><span className="text-green-600 font-bold">{form.slug || 'seu-link'}</span>
            </p>
          </div>
          <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-green-500/30 hover:shadow-2xl transition-all flex items-center justify-center gap-3 text-lg mt-6 disabled:opacity-50">
            <Sparkles size={20} /> {loading ? 'Criando...' : 'Criar Minha Conta'}
          </button>
        </form>
      </main>
    </div>
  );
}

function TelaLogin({ setTela, tenants, setTenant }) {
  const [slug, setSlug] = useState('');
  const [senha, setSenha] = useState('');

  const login = (e) => {
    e.preventDefault();
    const t = tenants.find(x => x.slug === slug.toLowerCase());
    if (!t) { alert('Loja não encontrada'); return; }
    if (t.password !== senha) { alert('Senha incorreta'); return; }
    setTenant(t);
    setTela('admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <header className="bg-white/80 backdrop-blur-md border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => setTela('home')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={24} />
        </button>
        <span className="text-gray-500 font-medium">Voltar</span>
      </header>

      <main className="max-w-md mx-auto p-6">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-xl shadow-orange-500/30">
            🏪
          </div>
          <h1 className="text-2xl font-black text-gray-900">Acessar Lanchonete</h1>
        </div>

        <form onSubmit={login} className="space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <input className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none font-mono" 
                   value={slug} onChange={e => setSlug(e.target.value)} placeholder="identificador-da-loja"/>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <input type="password" className="w-full text-lg font-bold text-gray-900 placeholder-gray-300 outline-none" 
                   value={senha} onChange={e => setSenha(e.target.value)} placeholder="senha"/>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-orange-500/30 hover:shadow-2xl transition-all text-lg mt-6">
            Entrar
          </button>
        </form>
      </main>
    </div>
  );
}

function TelaCardapio({ tenant, carrinho, addCarrinho, setTela }) {
  const [cat, setCat] = useState('Lanches');
  const [prods, setProds] = useState(PRODUTOS_PADRAO);
  const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);

  const cats = [...new Set(prods.map(p => p.categoria))];
  const filtrados = prods.filter(p => p.categoria === cat && p.disponivel !== false);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setTela('home')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Home size={20} />
              </button>
              <div>
                <h1 className="font-black text-xl">{tenant.name}</h1>
                <div className="flex items-center gap-1 text-orange-100 text-sm">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Aberto
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTela('carrinho')} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors relative">
                <ShoppingCart size={20} />
                {totalItens > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full text-xs font-black flex items-center justify-center">{totalItens}</span>
                )}
              </button>
              <button onClick={() => setTela('login')} className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <User size={20} />
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {cats.map(c => (
              <button key={c} onClick={() => setCat(c)}
                      className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                        cat === c ? 'bg-white text-orange-600 shadow-lg' : 'bg-white/20 text-white hover:bg-white/30'
                      }`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto p-4 space-y-4">
        {filtrados.map(p => (
          <div key={p.id} className="bg-white rounded-3xl shadow-lg shadow-gray-200/50 overflow-hidden border border-gray-100">
            <div className="h-48 bg-gray-100 relative overflow-hidden">
              {p.imagem.startsWith('data:') || p.imagem.startsWith('http') ? (
                <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl bg-gradient-to-br from-orange-100 to-orange-50">
                  {p.imagem}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-black text-xl text-gray-900">{p.nome}</h3>
                <span className="text-xl font-black text-orange-600">R$ {p.preco.toFixed(2)}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4">{p.descricao}</p>
              <button onClick={() => addCarrinho(p)}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-3 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transition-all flex items-center justify-center gap-2">
                <ShoppingCart size={18} /> Adicionar
              </button>
            </div>
          </div>
        ))}
      </main>

      {totalItens > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
          <button onClick={() => setTela('carrinho')} 
                  className="max-w-lg mx-auto w-full bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-2xl shadow-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 px-3 py-1 rounded-lg font-black">{totalItens} itens</div>
              <span className="font-bold">Ver Carrinho</span>
            </div>
            <span className="font-black text-xl">R$ {carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0).toFixed(2)}</span>
          </button>
        </div>
      )}
    </div>
  );
}

function TelaCarrinho({ carrinho, attQtd, total, setTela, tenant, setPedido, limpar }) {
  const [cliente, setCliente] = useState({ nome: '', tipo: 'entrega', endereco: '' });

  if (carrinho.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-400 mb-2">Carrinho vazio</h2>
        <button onClick={() => setTela('cardapio')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-8 rounded-2xl shadow-lg">
          Voltar ao cardápio
        </button>
      </div>
    );
  }

  const finalizar = async () => {
    if (!cliente.nome) { alert('Informe seu nome'); return; }
    const pedido = {
      tenant_id: tenant.id,
      customer_name: cliente.nome,
      order_type: cliente.tipo,
      items: JSON.stringify(carrinho),
      total: total,
      status: 'aguardando'
    };
    const { data, error } = await supabase.from('orders').insert([pedido]).select().single();
    if (error) { alert('Erro ao salvar pedido'); return; }
    setPedido(data);

    let msg = `🍔 *Pedido ${tenant.name}*\n\n👤 ${cliente.nome}\n`;
    if (cliente.tipo === 'entrega') msg += `📍 ${cliente.endereco}\n`;
    if (cliente.tipo === 'mesa') msg += `🪑 Mesa: ${cliente.endereco}\n`;
    msg += `\n*Itens:*\n`;
    carrinho.forEach(i => msg += `• ${i.qtd}x ${i.nome} - R$ ${(i.preco * i.qtd).toFixed(2)}\n`);
    msg += `\n💰 *Total:* R$ ${total.toFixed(2)}`;

    window.open(`https://wa.me/${tenant.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
    limpar();
    setTela('pedido');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white border-b p-4 flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => setTela('cardapio')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black flex-1">Meu Carrinho</h1>
        <button onClick={limpar} className="text-red-500 font-bold text-sm">Limpar</button>
      </header>

      <div className="max-w-lg mx-auto p-4 space-y-4">
        {carrinho.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl overflow-hidden">
              {item.imagem.startsWith('data:') || item.imagem.startsWith('http') ? (
                <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">{item.imagem}</span>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-black text-lg">{item.nome}</h3>
              <p className="text-orange-600 font-bold">R$ {item.preco.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
              <button onClick={() => attQtd(item.id, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-orange-600 font-bold">
                <Minus size={16} />
              </button>
              <span className="font-black w-4 text-center">{item.qtd}</span>
              <button onClick={() => attQtd(item.id, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-orange-600 font-bold">
                <Plus size={16} />
              </button>
            </div>
          </div>
        ))}

        <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-black text-gray-900">Dados para entrega</h3>
          <input className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                 placeholder="Seu nome completo" value={cliente.nome} onChange={e => setCliente({...cliente, nome: e.target.value})}/>
          <div className="flex gap-2">
            {['entrega', 'retirada', 'mesa'].map(t => (
              <button key={t} onClick={() => setCliente({...cliente, tipo: t})}
                      className={`flex-1 py-3 rounded-xl font-bold capitalize transition-all ${
                        cliente.tipo === t ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
                      }`}>
                {t}
              </button>
            ))}
          </div>
          {cliente.tipo === 'entrega' && (
            <input className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" 
                   placeholder="Endereço completo" value={cliente.endereco} onChange={e => setCliente({...cliente, endereco: e.target.value})}/>
          )}
          {cliente.tipo === 'mesa' && (
            <input className="w-full p-4 bg-gray-50 rounded-xl font-bold text-center text-2xl outline-none focus:ring-2 focus:ring-orange-500" 
                   placeholder="Nº da mesa" value={cliente.endereco} onChange={e => setCliente({...cliente, endereco: e.target.value})}/>
          )}
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 rounded-2xl text-white">
          <div className="flex justify-between items-center">
            <span className="font-bold opacity-90">Total do pedido</span>
            <span className="text-3xl font-black">R$ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button onClick={finalizar} disabled={!cliente.nome}
                className="max-w-lg mx-auto w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-xl disabled:opacity-50 flex items-center justify-center gap-2">
          <Check size={20} /> Finalizar Pedido
        </button>
      </div>
    </div>
  );
}

function TelaPedido({ pedido, tenant, setTela }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-500/30">
        <Check size={48} className="text-white" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Pedido Enviado!</h1>
      <p className="text-gray-600 mb-6">Seu pedido foi enviado para o WhatsApp de <strong>{tenant.name}</strong></p>
      <div className="bg-white p-6 rounded-3xl shadow-xl mb-8 w-full max-w-sm">
        <p className="text-sm text-gray-500 mb-1">Número do pedido</p>
        <p className="text-3xl font-black text-orange-600">#{pedido.id.slice(-6).toUpperCase()}</p>
      </div>
      <button onClick={() => setTela('cardapio')} className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-10 rounded-2xl shadow-xl">
        Voltar ao Cardápio
      </button>
    </div>
  );
}

// ============================================
// TELA ADMIN COM IMPRESSÃO INTEGRADA
// ============================================
function TelaAdmin({ tenant, setTenant, setTela, printQueue, setPrintQueue }) {
  const [aba, setAba] = useState('resumo');
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [formTenant, setFormTenant] = useState({ ...tenant });
  const [mostrarFormProduto, setMostrarFormProduto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarDados, 3000);
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    const { data: ords } = await supabase.from('orders').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false });
    setPedidos(ords || []);

    const { data: prods } = await supabase.from('products').select('*').eq('tenant_id', tenant.id);
    if (prods && prods.length > 0) {
      setProdutos(prods.map(p => ({
        id: p.id,
        nome: p.name,
        preco: p.price,
        categoria: p.category,
        imagem: p.image || '🍔',
        descricao: p.description,
        disponivel: p.available
      })));
    } else {
      setProdutos(PRODUTOS_PADRAO);
    }
  };

  const salvarTenant = async () => {
    const { error } = await supabase.from('tenants').update({ 
      name: formTenant.name, whatsapp: formTenant.whatsapp 
    }).eq('id', tenant.id);
    if (!error) {
      setTenant({ ...tenant, ...formTenant });
      alert('Dados salvos!');
    }
  };

  const salvarProduto = async (produto) => {
    try {
      const produtoDB = {
        tenant_id: tenant.id,
        name: produto.nome,
        price: produto.preco,
        category: produto.categoria,
        image: produto.imagem,
        description: produto.descricao,
        available: produto.disponivel
      };

      if (produto.id && produtos.find(p => p.id === produto.id)) {
        await supabase.from('products').update(produtoDB).eq('id', produto.id);
        setProdutos(prods => prods.map(p => p.id === produto.id ? produto : p));
      } else {
        const { data } = await supabase.from('products').insert([produtoDB]).select().single();
        if (data) {
          setProdutos([...produtos, { ...produto, id: data.id }]);
        } else {
          setProdutos([...produtos, { ...produto, id: Date.now() }]);
        }
      }
    } catch (e) {
      if (produto.id && produtos.find(p => p.id === produto.id)) {
        setProdutos(prods => prods.map(p => p.id === produto.id ? produto : p));
      } else {
        setProdutos([...produtos, { ...produto, id: Date.now() }]);
      }
    }
    setMostrarFormProduto(false);
    setProdutoEditando(null);
  };

  const excluirProduto = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (e) {}
    setProdutos(prods => prods.filter(p => p.id !== id));
  };

  const toggleDisponivel = async (produto) => {
    const novo = { ...produto, disponivel: !produto.disponivel };
    try {
      await supabase.from('products').update({ available: novo.disponivel }).eq('id', produto.id);
    } catch (e) {}
    setProdutos(prods => prods.map(p => p.id === produto.id ? novo : p));
  };

  const atualizarStatusPedido = async (pedidoId, novoStatus) => {
    const { error } = await supabase.from('orders').update({ status: novoStatus }).eq('id', pedidoId);
    if (!error) {
      setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, status: novoStatus } : p));
      if (novoStatus === 'cozinha') {
        const pedido = pedidos.find(p => p.id === pedidoId);
        if (pedido) triggerPrint(pedido);
      }
    }
  };

  const triggerPrint = (order) => {
    setPrintQueue(prev => [...prev, order]);
    setTimeout(() => {
      printOrderReceipt(order);
    }, 500);
  };

  const printOrderReceipt = (order) => {
    const items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Pedido ${order.id.slice(0, 8)}</title>
        <style>
          * { margin: 0; padding: 0; }
          body {
            font-family: 'Courier New', monospace;
            width: 80mm;
            padding: 10px;
            background: white;
          }
          .header {
            text-align: center;
            font-size: 18px;
            font-weight: bold;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 10px;
          }
          .loja { font-size: 14px; margin-bottom: 5px; }
          .pedido-info {
            margin-bottom: 10px;
            font-size: 12px;
          }
          .itens {
            border-top: 1px solid #000;
            border-bottom: 1px solid #000;
            padding: 10px 0;
            margin: 10px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 5px;
          }
          .total {
            text-align: right;
            font-size: 14px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid #000;
          }
          .footer {
            text-align: center;
            margin-top: 10px;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="header">PEDIDO Nº ${order.id.slice(0, 8).toUpperCase()}</div>
        <div class="loja">${tenant.name}</div>
        <div class="pedido-info">
          <strong>Cliente:</strong> ${order.customer_name}<br>
          <strong>Tipo:</strong> ${order.order_type.toUpperCase()}
        </div>
        <div class="itens">
          ${items.map(item => `<div class="item"><span>${item.qtd}x ${item.nome}</span><span>R$ ${(item.preco * item.qtd).toFixed(2)}</span></div>`).join('')}
        </div>
        <div class="total">
          Total: R$ ${order.total.toFixed(2)}
        </div>
        <div class="footer">
          ✓ Pedido chegou na cozinha
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '', 'width=320,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();

    setTimeout(() => {
      setPrintQueue(prev => prev.filter(p => p.id !== order.id));
    }, 1500);
  };

  const stats = {
    total: pedidos.length,
    aguardando: pedidos.filter(p => p.status === 'aguardando').length,
    cozinha: pedidos.filter(p => p.status === 'cozinha').length,
    entregues: pedidos.filter(p => p.status === 'entregue').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button onClick={() => setTela('cardapio')} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <Home size={20} />
              </button>
              <div>
                <h1 className="font-black text-xl">{tenant.name}</h1>
                <p className="text-orange-100 text-sm">Painel Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setTela('cardapio')} className="px-4 py-2 bg-white/20 rounded-full text-sm font-bold hover:bg-white/30 transition-colors flex items-center gap-2">
                <Store size={16} /> Cardápio
              </button>
              <button onClick={() => { setTenant(null); setTela('home'); }} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex border-t border-white/20">
          {[
            { id: 'resumo', label: 'Resumo', icon: BarChart3 },
            { id: 'cozinha', label: 'Cozinha', icon: ChefHat },
            { id: 'cardapio', label: 'Cardápio', icon: Package },
            { id: 'ajustes', label: 'Ajustes', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setAba(id)}
                    className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                      aba === id ? 'bg-white text-orange-600' : 'text-white/80 hover:bg-white/10'
                    }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-lg mx-auto p-4">
        {/* FILA DE IMPRESSÃO */}
        {printQueue.length > 0 && (
          <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Printer className="text-yellow-600" size={20} />
              <h3 className="font-black text-yellow-800">Fila de Impressão: {printQueue.length}</h3>
            </div>
            <div className="space-y-1 text-sm text-yellow-700">
              {printQueue.map(order => (
                <p key={order.id}>📋 {order.customer_name}</p>
              ))}
            </div>
          </div>
        )}

        {/* RESUMO */}
        {aba === 'resumo' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-orange-500">
                <p className="text-3xl font-black text-orange-600">{stats.total}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Pedidos</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-3xl font-black text-yellow-600">{stats.aguardando}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Aguardando</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-red-500">
                <p className="text-3xl font-black text-red-600">{stats.cozinha}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Cozinha</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-l-4 border-green-500">
                <p className="text-3xl font-black text-green-600">{stats.entregues}</p>
                <p className="text-xs font-bold text-gray-500 uppercase">Entregues</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4">
              <h3 className="font-black text-gray-900 mb-4">Últimos Pedidos</h3>
              {pedidos.length === 0 ? (
                <p className="text-center text-gray-400 py-8">Nenhum pedido ainda</p>
              ) : (
                <div className="space-y-3">
                  {pedidos.slice(0, 5).map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-bold">{p.customer_name}</p>
                        <p className="text-xs text-gray-500">#{p.id.slice(-6)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === 'aguardando' ? 'bg-yellow-100 text-yellow-700' :
                        p.status === 'cozinha' ? 'bg-red-100 text-red-700' :
                        p.status === 'pronto' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{p.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* COZINHA COM IMPRESSÃO */}
        {aba === 'cozinha' && (
          <div className="space-y-3">
            <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
              <Clock size={20} /> Fila de Pedidos
            </h3>
            
            {pedidos.filter(p => p.status === 'aguardando').length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl">
                <ChefHat size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Nenhum pedido aguardando</p>
              </div>
            ) : (
              pedidos.filter(p => p.status === 'aguardando').map(p => {
                const items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items;
                return (
                  <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-black text-lg">{p.customer_name}</p>
                        <p className="text-xs text-gray-500">#{p.id.slice(-6)}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Aguardando</span>
                    </div>
                    <div className="space-y-1 mb-3 p-3 bg-gray-50 rounded-lg">
                      {items.map((item, idx) => (
                        <p key={idx} className="text-sm text-gray-600"><strong>{item.qtd}x</strong> {item.nome}</p>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => atualizarStatusPedido(p.id, 'cozinha')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <ChefHat size={16} /> Cozinha
                      </button>
                      <button 
                        onClick={() => atualizarStatusPedido(p.id, 'pronto')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                        <Check size={16} /> Pronto
                      </button>
                    </div>
                  </div>
                );
              })
            )}

            {pedidos.filter(p => p.status === 'cozinha').length > 0 && (
              <>
                <h3 className="font-black text-lg text-gray-900 mt-6 flex items-center gap-2">
                  <ChefHat size={20} /> Na Cozinha
                </h3>
                {pedidos.filter(p => p.status === 'cozinha').map(p => {
                  const items = typeof p.items === 'string' ? JSON.parse(p.items) : p.items;
                  return (
                    <div key={p.id} className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-200">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-black text-lg">{p.customer_name}</p>
                          <p className="text-xs text-gray-500">#{p.id.slice(-6)}</p>
                        </div>
                        <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold animate-pulse">Na Cozinha</span>
                      </div>
                      <div className="space-y-1 mb-3 p-3 bg-white rounded-lg">
                        {items.map((item, idx) => (
                          <p key={idx} className="text-sm text-gray-600"><strong>{item.qtd}x</strong> {item.nome}</p>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => printOrderReceipt(p)}
                          className="flex-1 bg-purple-600 text-white font-bold py-2 rounded-xl hover:bg-purple-700 transition-all flex items-center justify-center gap-2 animate-pulse">
                          <Printer size={16} /> Reimprimir
                        </button>
                        <button 
                          onClick={() => atualizarStatusPedido(p.id, 'pronto')}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <Check size={16} /> Pronto
                        </button>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}

        {/* CARDÁPIO */}
        {aba === 'cardapio' && (
          <div className="space-y-4">
            <button onClick={() => { setProdutoEditando(null); setMostrarFormProduto(true); }}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <Plus size={24} /> Novo Produto
            </button>

            {produtos.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                    {p.imagem.startsWith('data:') || p.imagem.startsWith('http') ? (
                      <img src={p.imagem} alt={p.nome} className="w-full h-full object-cover" />
                    ) : (
                      <span>{p.imagem}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold truncate">{p.nome}</p>
                    <p className="text-orange-600 font-bold">R$ {p.preco.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{p.categoria}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => toggleDisponivel(p)}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              p.disponivel !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                      {p.disponivel !== false ? 'Ativo' : 'Inativo'}
                    </button>
                    <div className="flex gap-1">
                      <button onClick={() => { setProdutoEditando(p); setMostrarFormProduto(true); }}
                              className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => excluirProduto(p.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AJUSTES */}
        {aba === 'ajustes' && (
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-black text-xl mb-4">Ajustes da Loja</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome</label>
              <input className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" value={formTenant.name} onChange={e => setFormTenant({...formTenant, name: e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">WhatsApp</label>
              <input className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500" value={formTenant.whatsapp} onChange={e => setFormTenant({...formTenant, whatsapp: e.target.value})}/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Link do cardápio</label>
              <p className="text-sm text-orange-600 font-mono break-all">{window.location.origin}/?s={tenant.slug}</p>
            </div>
            <button onClick={salvarTenant} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
              <Save size={20} /> Salvar
            </button>
          </div>
        )}
      </div>

      {mostrarFormProduto && (
        <FormProdutoModal 
          produto={produtoEditando}
          onSalvar={salvarProduto}
          onFechar={() => { setMostrarFormProduto(false); setProdutoEditando(null); }}
        />
      )}
    </div>
  );
}

// ============================================
// MODAL FORM PRODUTO
// ============================================
function FormProdutoModal({ produto, onSalvar, onFechar }) {
  const [form, setForm] = useState({
    nome: produto?.nome || '',
    preco: produto?.preco || '',
    categoria: produto?.categoria || 'Lanches',
    descricao: produto?.descricao || '',
    imagem: produto?.imagem || '🍔',
    disponivel: produto?.disponivel !== false
  });
  const [preview, setPreview] = useState(null);
  const [abaImagem, setAbaImagem] = useState('emoji');
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleImagemUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let { width, height } = img;
        const maxWidth = 800;
        const maxHeight = 600;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setPreview(dataUrl);
        setForm({ ...form, imagem: dataUrl });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome || !form.preco) {
      alert('Preencha nome e preço');
      return;
    }
    onSalvar({
      ...produto,
      nome: form.nome,
      preco: parseFloat(form.preco),
      categoria: form.categoria,
      descricao: form.descricao,
      imagem: form.imagem,
      disponivel: form.disponivel
    });
  };

  const emojis = ['🍔', '🥓', '🥗', '🥤', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🍖', '🍗', '🥩', '🍠', '🥟', '🥠', '🥡', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🍡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯'];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-xl font-black">{produto ? 'Editar Produto' : 'Novo Produto'}</h2>
          <button onClick={onFechar} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="flex justify-center">
            <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center text-6xl overflow-hidden shadow-inner">
              {preview || form.imagem.startsWith('data:') || form.imagem.startsWith('http') ? (
                <img src={preview || form.imagem} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-6xl">{form.imagem}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button type="button" onClick={() => setAbaImagem('emoji')} 
                    className={`flex-1 py-2 rounded-xl font-bold text-sm ${abaImagem === 'emoji' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
              Emoji
            </button>
            <button type="button" onClick={() => { setAbaImagem('upload'); fileInputRef.current?.click(); }}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 ${abaImagem === 'upload' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
              <Upload size={16} /> Upload
            </button>
            <button type="button" onClick={() => { setAbaImagem('camera'); cameraInputRef.current?.click(); }}
                    className={`flex-1 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 ${abaImagem === 'camera' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}>
              <Camera size={16} /> Foto
            </button>
          </div>

          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImagemUpload} />
          <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleImagemUpload} />

          {abaImagem === 'emoji' && (
            <div className="grid grid-cols-8 gap-2 p-2 bg-gray-50 rounded-xl max-h-32 overflow-y-auto">
              {emojis.map(emoji => (
                <button key={emoji} type="button" onClick={() => setForm({ ...form, imagem: emoji })}
                        className={`text-2xl p-2 rounded-lg hover:bg-white transition-colors ${form.imagem === emoji ? 'bg-orange-200' : ''}`}>
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nome do produto *</label>
            <input className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                   value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: X-Burger Duplo"/>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Preço (R$) *</label>
              <input type="number" step="0.01" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                     value={form.preco} onChange={e => setForm({...form, preco: e.target.value})} placeholder="19.90"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Categoria *</label>
              <select className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500"
                      value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Descrição</label>
            <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      rows={3} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} 
                      placeholder="Pão brioche, 2 carnes de 180g, queijo cheddar..."/>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-bold">Produto disponível</p>
              <p className="text-xs text-gray-500">Aparece no cardápio</p>
            </div>
            <button type="button" onClick={() => setForm({...form, disponivel: !form.disponivel})}
                    className={`w-14 h-8 rounded-full transition-colors relative ${form.disponivel ? 'bg-green-500' : 'bg-gray-300'}`}>
              <div className={`w-6 h-6 bg-white rounded-full absolute top-1 transition-transform ${form.disponivel ? 'translate-x-7' : 'translate-x-1'}`}></div>
            </button>
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2">
            <Save size={20} /> {produto ? 'Salvar Alterações' : 'Criar Produto'}
          </button>
        </form>
      </div>
    </div>
  );
}
