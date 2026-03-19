import React, { useState } from 'react';
import { Store } from '../types';

interface AdminLoginViewProps {
  allStores: Store[];
  onLoginSuccess: (store: Store) => void;
  onBack: () => void;
}

const AdminLoginView: React.FC<AdminLoginViewProps> = ({ allStores, onLoginSuccess, onBack }) => {
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Procura a lanchonete pelo slug
      const store = allStores.find(s => s.slug.toLowerCase() === slug.toLowerCase());

      if (!store) {
        setError('Lanchonete não encontrada. Verifique o identificador.');
        setIsLoading(false);
        return;
      }

      // Valida a senha
      if (store.adminPassword !== password) {
        setError('Senha incorreta. Tente novamente.');
        setIsLoading(false);
        return;
      }

      // Login bem-sucedido
      onLoginSuccess(store);
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="text-lg font-black tracking-tight flex-1 text-center">Acesse sua Lanchonete</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-primary text-4xl">admin_panel_settings</span>
            </div>
            <h2 className="text-2xl font-black mb-2">Painel de Controle</h2>
            <p className="text-sm text-gray-400 font-medium">Digite seus dados de acesso</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-red-500 text-xl mt-0.5">error</span>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#9c7349] px-1 tracking-widest">
                Identificador da Lanchonete (@)
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="Ex: comabem"
                disabled={isLoading}
                className="w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl font-mono font-bold focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
              />
              <p className="text-[10px] text-gray-400 px-1 font-bold">
                O identificador que você criou ao cadastrar sua lanchonete
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-[#9c7349] px-1 tracking-widest">
                Senha de Acesso
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  disabled={isLoading}
                  className="w-full p-4 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl font-bold focus:outline-none focus:border-primary transition-colors disabled:opacity-50 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !slug || !password}
              className="w-full bg-primary text-white font-black py-4 rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">login</span>
                  ENTRAR
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
            <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">
              Primeira vez aqui?
            </p>
            <button
              onClick={onBack}
              className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-primary font-black py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">add_business</span>
              Criar uma Lanchonete
            </button>
          </div>
        </div>
      </main>

      <footer className="px-6 py-6 border-t border-gray-100 dark:border-white/5 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
        Pedido Rápido AI - Sistema Multi-Tenant
      </footer>
    </div>
  );
};

export default AdminLoginView;