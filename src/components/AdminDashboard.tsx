import React, { useState } from 'react';
import { Product, Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  slug: string;
  whatsappNumber: string;
  isOpen: boolean;
  orders: Order[];
  onToggleStoreStatus: () => void;
  onUpdateWhatsApp: (w: string) => void;
  onUpdateStoreSettings: (settings: any) => void;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => void;
  products: Product[];
  categories: string[];
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onBack: () => void;
  onUpdatePassword: (p: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  slug,
  whatsappNumber,
  isOpen,
  orders = [],
  onToggleStoreStatus,
  onUpdateWhatsApp,
  onUpdateOrderStatus,
  products = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<'KITCHEN' | 'PRODUCTS' | 'STATS' | 'SETTINGS'>('KITCHEN');
  const [copied, setCopied] = useState(false);
  const [newWA, setNewWA] = useState(whatsappNumber);

  const storeLink = `${window.location.origin}?s=${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(storeLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pendingOrders = orders.filter(o => 
    o.status === 'Received' || o.status === 'Preparing'
  );

  const completedOrders = orders.filter(o => 
    o.status === 'Ready' || o.status === 'Delivered' || o.status === 'Cancelled'
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-200 dark:border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="text-gray-600 dark:text-gray-300 hover:text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-xl font-black text-primary">Painel Admin</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleStoreStatus}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
              isOpen 
                ? 'bg-green-500/20 text-green-600 dark:bg-green-600/20 dark:text-green-400'
                : 'bg-red-500/20 text-red-600 dark:bg-red-600/20 dark:text-red-400'
            }`}
          >
            {isOpen ? 'Loja Aberta' : 'Loja Fechada'}
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-white/50 dark:bg-black/20 border-b border-gray-200 dark:border-white/5">
        {(['KITCHEN', 'PRODUCTS', 'STATS', 'SETTINGS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-6 text-sm font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-4 border-primary'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab === 'KITCHEN' ? 'Cozinha' :
             tab === 'PRODUCTS' ? 'Produtos' :
             tab === 'STATS' ? 'Estatísticas' : 'Configurações'}
          </button>
        ))}
      </div>

      <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
        {activeTab === 'KITCHEN' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-black mb-4">Pedidos Pendentes ({pendingOrders.length})</h2>
              {pendingOrders.length === 0 ? (
                <div className="bg-white/50 dark:bg-black/20 rounded-2xl p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Nenhum pedido pendente no momento</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="bg-white dark:bg-black/30 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-sm text-gray-500">#{order.id.slice(-6)}</p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          {order.status}
                        </span>
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.product.name}</span>
                            <span>R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-bold pt-3 border-t border-gray-100 dark:border-white/10">
                        <span>Total</span>
                        <span>R$ {order.total.toFixed(2)}</span>
                      </div>
                      <div className="mt-6 flex gap-3">
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Preparing')}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold"
                        >
                          Iniciar Preparo
                        </button>
                        <button
                          onClick={() => onUpdateOrderStatus(order.id, 'Ready')}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold"
                        >
                          Pronto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-black mb-4">Histórico de Pedidos</h2>
              {completedOrders.length === 0 ? (
                <p className="text-gray-500">Nenhum pedido concluído ainda</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {completedOrders.slice(0, 6).map(order => (
                    <div key={order.id} className="bg-white/50 dark:bg-black/20 p-5 rounded-2xl">
                      <p className="font-bold">{order.customerName}</p>
                      <p className="text-sm text-gray-500">R$ {order.total.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'PRODUCTS' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-black">Produtos do Cardápio</h2>
              <button
                onClick={onAddProduct}
                className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Novo Produto
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product.id} className="bg-white dark:bg-black/30 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/5">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-primary font-black mt-1">R$ {product.price.toFixed(2)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        product.isAvailable 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {product.isAvailable ? 'Disponível' : 'Indisponível'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onEditProduct(product)}
                        className="flex-1 bg-gray-100 dark:bg-white/10 py-2 rounded-xl text-sm font-bold"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => onDeleteProduct(product.id)}
                        className="flex-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-2 rounded-xl text-sm font-bold"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Nenhum produto cadastrado ainda</p>
                <button
                  onClick={onAddProduct}
                  className="mt-4 bg-primary text-white px-8 py-4 rounded-2xl font-black"
                >
                  Adicionar Primeiro Produto
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'STATS' && (
          <div className="space-y-8 text-center">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-black/30 p-8 rounded-3xl">
                <p className="text-4xl font-black text-primary">
                  {orders.length}
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
                  Total de Pedidos
                </p>
              </div>
              <div className="bg-white dark:bg-black/30 p-8 rounded-3xl">
                <p className="text-4xl font-black text-primary">
                  R$ {orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}
                </p>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500 mt-2">
                  Faturamento Total
                </p>
              </div>
            </div>
            <p className="text-gray-500">Mais estatísticas em breve...</p>
          </div>
        )}

        {activeTab === 'SETTINGS' && (
          <div className="space-y-8 max-w-md mx-auto">
            <div className="bg-white dark:bg-black/30 rounded-2xl p-6">
              <h3 className="font-black mb-4">Link do Cardápio</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={storeLink}
                  readOnly
                  className="flex-1 p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-sm font-mono"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-5 py-3 rounded-xl font-bold transition-all ${
                    copied ? 'bg-green-500 text-white' : 'bg-primary text-white'
                  }`}
                >
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-black/30 rounded-2xl p-6">
              <h3 className="font-black mb-4">WhatsApp de Vendas</h3>
              <div className="flex gap-2">
                <input
                  type="tel"
                  value={newWA}
                  onChange={e => setNewWA(e.target.value)}
                  className="flex-1 p-3 bg-gray-50 dark:bg-black/20 rounded-xl text-sm"
                  placeholder="Ex: 5585999999999"
                />
                <button
                  onClick={() => onUpdateWhatsApp(newWA)}
                  className="px-6 py-3 bg-primary text-white rounded-xl font-bold"
                >
                  Salvar
                </button>
              </div>
            </div>

            {/* Outras configurações podem ser adicionadas aqui */}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
