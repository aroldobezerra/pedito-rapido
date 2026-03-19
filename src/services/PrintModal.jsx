import React from 'react';
import { X, Printer, Wifi, Check, AlertCircle, Loader } from 'lucide-react';

export default function PrintModal({
  isOpen,
  order,
  storeName,
  selectedMethod,
  printerIP,
  printerPort,
  isPrinting,
  status,
  statusMessage,
  onSetMethod,
  onSetPrinterIP,
  onSetPrinterPort,
  onPrint,
  onCheckPrinter,
  onClose
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <Printer size={24} />
            <h2 className="text-xl font-black">Imprimir Pedido</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Info do Pedido */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
            <p className="text-sm text-gray-500 font-bold uppercase">Pedido a imprimir</p>
            <p className="font-black text-lg">#{order.id.slice(-6).toUpperCase()}</p>
            <p className="text-sm text-gray-600">{order.customerName}</p>
            <p className="text-sm text-orange-600 font-bold">R$ {order.total.toFixed(2)}</p>
          </div>

          {/* Seleção de Método */}
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-500 uppercase">Tipo de impressora</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onSetMethod('usb')}
                className={`p-4 rounded-2xl font-bold text-center transition-all ${
                  selectedMethod === 'usb'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔌 USB
              </button>
              <button
                onClick={() => onSetMethod('network')}
                className={`p-4 rounded-2xl font-bold text-center transition-all ${
                  selectedMethod === 'network'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Wifi size={16} className="mx-auto mb-1" /> Rede
              </button>
            </div>
          </div>

          {/* Configuração de Rede (se selecionado) */}
          {selectedMethod === 'network' && (
            <div className="space-y-3 bg-blue-50 p-4 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">IP da Impressora</label>
                <input
                  type="text"
                  value={printerIP}
                  onChange={(e) => onSetPrinterIP(e.target.value)}
                  placeholder="192.168.1.100"
                  className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase block mb-2">Porta</label>
                <input
                  type="number"
                  value={printerPort}
                  onChange={(e) => onSetPrinterPort(e.target.value)}
                  placeholder="9100"
                  className="w-full p-3 border border-gray-200 rounded-lg font-mono text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Status */}
          {statusMessage && (
            <div className={`p-4 rounded-2xl flex items-start gap-3 ${
              status === 'error' ? 'bg-red-50 border border-red-200' :
              status === 'success' ? 'bg-green-50 border border-green-200' :
              status === 'printing' ? 'bg-blue-50 border border-blue-200' :
              'bg-yellow-50 border border-yellow-200'
            }`}>
              {status === 'error' && <AlertCircle size={20} className="text-red-500 mt-0.5 shrink-0" />}
              {status === 'success' && <Check size={20} className="text-green-500 mt-0.5 shrink-0" />}
              {status === 'printing' && <Loader size={20} className="text-blue-500 mt-0.5 shrink-0 animate-spin" />}
              {status === 'checking' && <Loader size={20} className="text-yellow-500 mt-0.5 shrink-0 animate-spin" />}
              <p className={`text-sm font-bold ${
                status === 'error' ? 'text-red-700' :
                status === 'success' ? 'text-green-700' :
                status === 'printing' ? 'text-blue-700' :
                'text-yellow-700'
              }`}>
                {statusMessage}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onCheckPrinter}
              disabled={isPrinting || !selectedMethod || (selectedMethod === 'network' && !printerIP)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-700 font-bold py-3 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              🔍 Testar
            </button>
            <button
              onClick={onPrint}
              disabled={isPrinting || !selectedMethod || (selectedMethod === 'network' && !printerIP)}
              className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-2xl shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isPrinting ? (
                <>
                  <Loader size={18} className="animate-spin" /> Imprimindo...
                </>
              ) : (
                <>
                  <Printer size={18} /> Imprimir
                </>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            disabled={isPrinting}
            className="w-full bg-gray-50 hover:bg-gray-100 disabled:opacity-50 text-gray-700 font-bold py-3 rounded-2xl transition-all"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
