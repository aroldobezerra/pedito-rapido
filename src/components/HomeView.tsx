import React from 'react';

interface HomeViewProps {
  onRegister: () => void;
  onAdminLogin: () => void;
  onSaaSAdmin: () => void;
}

const HomeView: React.FC<HomeViewProps> = ({ onRegister, onAdminLogin, onSaaSAdmin }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background-light to-white dark:from-background-dark dark:to-[#1a1410]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-lg">
            🚀
          </div>
          <span className="font-black text-sm">Pedido Rápido AI</span>
        </div>
        <button
          onClick={onSaaSAdmin}
          className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-xs">admin_panel_settings</span>
          Admin
        </button>
      </header>

      {/* Hero Section */}
      <section className="flex-1 px-6 pt-12 pb-20 max-w-2xl mx-auto w-full flex flex-col justify-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full w-fit mx-auto mb-6 font-black uppercase text-[10px] tracking-widest">
          <span className="material-symbols-outlined text-sm">verified</span>
          Plataforma SaaS Premium
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.1] text-gray-900 dark:text-white text-center mb-6">
          Transforme seu Negócio em um{' '}
          <span className="bg-gradient-to-r from-primary via-green-500 to-emerald-500 bg-clip-text text-transparent">
            Império Digital
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 text-center max-w-xl mx-auto font-medium mb-12 leading-relaxed">
          Cardápios inteligentes com IA, pedidos via WhatsApp e gestão profissional para Lanchonetes, Pizzarias, Açaís e muito mais.
        </p>

        {/* CTA Buttons - Main Section */}
        <div className="space-y-4 mb-12">
          {/* Primary CTA: Teste Grátis */}
          <button
            onClick={onRegister}
            className="w-full bg-gradient-to-r from-primary to-green-500 text-white font-black px-8 py-5 rounded-3xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg md:text-xl tracking-tight"
          >
            <span className="material-symbols-outlined text-2xl">celebration</span>
            Teste Grátis por 10 Dias
          </button>

          {/* Secondary CTA: Acesse */}
          <button
            onClick={onAdminLogin}
            className="w-full bg-white dark:bg-white/10 border-2 border-primary text-primary dark:text-white font-black px-8 py-5 rounded-3xl shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg md:text-xl tracking-tight"
          >
            <span className="material-symbols-outlined text-2xl">login</span>
            Acesse sua Lanchonete
          </button>
        </div>

        {/* Benefits Section */}
        <div className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl p-8 space-y-6">
          <h3 className="text-sm font-black uppercase text-gray-400 tracking-widest">Por que escolher Pedido Rápido?</h3>

          <div className="space-y-6">
            {/* Benefit 1 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">auto_awesome</span>
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Fotos com IA</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Geramos imagens apetitosas automaticamente para seus produtos. Sem contratação de fotógrafo!
                </p>
              </div>
            </div>

            {/* Benefit 2 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">chat</span>
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Pedidos no WhatsApp</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Clientes fazem pedidos no cardápio online e chegam formatados na sua caixa de WhatsApp.
                </p>
              </div>
            </div>

            {/* Benefit 3 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">dashboard_customize</span>
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Painel Profissional</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Controle total de categorias, preços, estoque e impressão térmica na cozinha.
                </p>
              </div>
            </div>

            {/* Benefit 4 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Multi-Tenant</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Gerencie múltiplas lanchonetes em um único painel mestre com dados consolidados.
                </p>
              </div>
            </div>

            {/* Benefit 5 */}
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">speed</span>
              </div>
              <div>
                <h4 className="font-black text-sm mb-1">Rápido & Fácil</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Setup em 5 minutos. Não requer conhecimento técnico. Funciona no celular!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary/10 to-green-500/10 border-y border-gray-100 dark:border-white/5 px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-2xl font-black text-primary mb-1">500+</p>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Lanchonetes</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary mb-1">50K+</p>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Pedidos/Mês</p>
          </div>
          <div>
            <p className="text-2xl font-black text-primary mb-1">99%</p>
            <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Uptime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center space-y-4 border-t border-gray-100 dark:border-white/5">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          © 2024 Pedido Rápido AI - A tecnologia por trás do seu sucesso digital
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-[10px] text-gray-500 font-bold">Seguro</span>
          <span className="text-[10px] text-gray-500 font-bold">•</span>
          <span className="text-[10px] text-gray-500 font-bold">Rápido</span>
          <span className="text-[10px] text-gray-500 font-bold">•</span>
          <span className="text-[10px] text-gray-500 font-bold">24/7</span>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
