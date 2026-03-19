// ============================================
// Hook para gerenciar impressora térmica USB
// ============================================
import { useState } from 'react';

export function useThermalPrinter() {
  const [printState, setPrintState] = useState({
    isOpen: false,
    order: null,
    method: 'usb', // 'usb' ou 'network'
    printerIP: '',
    printerPort: 9100,
    isPrinting: false,
    status: '',
    statusMessage: ''
  });

  const openPrintModal = (order) => {
    setPrintState(prev => ({
      ...prev,
      isOpen: true,
      order,
      status: '',
      statusMessage: ''
    }));
  };

  const closePrintModal = () => {
    setPrintState(prev => ({
      ...prev,
      isOpen: false,
      order: null
    }));
  };

  const setMethod = (method) => {
    setPrintState(prev => ({ ...prev, method }));
  };

  const setPrinterIP = (ip) => {
    setPrintState(prev => ({ ...prev, printerIP: ip }));
  };

  const setPrinterPort = (port) => {
    setPrintState(prev => ({ ...prev, printerPort: parseInt(port) }));
  };

  const checkPrinter = async () => {
    if (printState.method === 'usb') {
      try {
        setPrintState(prev => ({ ...prev, status: 'checking', statusMessage: 'Procurando impressora USB...' }));
        
        const devices = await navigator.usb.getDevices();
        if (devices.length > 0) {
          setPrintState(prev => ({ ...prev, status: 'success', statusMessage: '✅ Impressora USB encontrada!' }));
          return true;
        } else {
          setPrintState(prev => ({ ...prev, status: 'error', statusMessage: '❌ Nenhuma impressora USB detectada' }));
          return false;
        }
      } catch (err) {
        setPrintState(prev => ({ ...prev, status: 'error', statusMessage: '❌ Erro ao acessar USB: ' + err.message }));
        return false;
      }
    } else {
      try {
        setPrintState(prev => ({ ...prev, status: 'checking', statusMessage: 'Testando conexão com impressora...' }));
        
        // Teste de conectividade básico
        const response = await fetch(`http://${printState.printerIP}:${printState.printerPort}`, { method: 'HEAD' });
        if (response.ok) {
          setPrintState(prev => ({ ...prev, status: 'success', statusMessage: '✅ Impressora conectada!' }));
          return true;
        } else {
          setPrintState(prev => ({ ...prev, status: 'error', statusMessage: '❌ Impressora não respondeu' }));
          return false;
        }
      } catch (err) {
        setPrintState(prev => ({ ...prev, status: 'error', statusMessage: '❌ Erro de conexão: ' + err.message }));
        return false;
      }
    }
  };

  const handlePrint = async () => {
    if (!printState.order) return;

    setPrintState(prev => ({ ...prev, isPrinting: true, status: 'printing', statusMessage: 'Imprimindo...' }));

    try {
      const escpos = generateESCPOS(printState.order);

      if (printState.method === 'usb') {
        await printUSB(escpos);
      } else {
        await printNetwork(escpos);
      }

      setPrintState(prev => ({ ...prev, isPrinting: false, status: 'success', statusMessage: '✅ Pedido impresso com sucesso!' }));
    } catch (err) {
      setPrintState(prev => ({ ...prev, isPrinting: false, status: 'error', statusMessage: '❌ Erro ao imprimir: ' + err.message }));
    }
  };

  const printUSB = async (escpos) => {
    const devices = await navigator.usb.getDevices();
    if (devices.length === 0) {
      throw new Error('Nenhuma impressora USB encontrada');
    }

    const device = devices[0];
    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);

    const encoder = new TextEncoder();
    const data = encoder.encode(escpos);
    await device.transferOut(1, data);
    await device.close();
  };

  const printNetwork = async (escpos) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(escpos);

    try {
      await fetch(`http://${printState.printerIP}:${printState.printerPort}`, {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/octet-stream'
        }
      });
    } catch (err) {
      throw new Error('Falha ao enviar para impressora de rede');
    }
  };

  const generateESCPOS = (order) => {
    let text = '';

    // Inicializar impressora
    text += '\x1B\x40'; // ESC @

    // Centralizar e ampliar fonte
    text += '\x1B\x61\x01'; // ESC a 1 (center)
    text += '\x1D\x21\x11'; // GS ! 11 (2x height, 2x width)

    text += 'PEDIDO RÁPIDO\n';
    text += '\x1D\x21\x00'; // Voltar ao normal
    text += '-'.repeat(40) + '\n\n';

    // Cabeçalho do pedido
    text += 'Pedido #' + order.id.slice(-6).toUpperCase() + '\n';
    text += 'Cliente: ' + order.customerName + '\n';
    text += 'Tipo: ' + order.deliveryMethod + '\n';

    if (order.tableNumber) {
      text += 'Mesa: ' + order.tableNumber + '\n';
    }
    if (order.address) {
      text += 'Endereço: ' + order.address + '\n';
    }

    text += '\n' + '-'.repeat(40) + '\n\n';

    // Itens
    text += 'ITENS DO PEDIDO:\n';
    try {
      const items = JSON.parse(order.itemsJson);
      items.forEach(item => {
        text += item.qtd + 'x ' + item.nome + '\n';
        text += '    R$ ' + (item.preco * item.qtd).toFixed(2) + '\n';
      });
    } catch (e) {
      text += 'Erro ao processar itens\n';
    }

    text += '\n' + '-'.repeat(40) + '\n';
    text += 'TOTAL: R$ ' + order.total.toFixed(2) + '\n';
    text += '-'.repeat(40) + '\n\n';

    // Data/Hora
    text += 'Data: ' + new Date().toLocaleString('pt-BR') + '\n';
    text += 'Status: ' + order.status + '\n\n';

    // Rodapé
    text += '\x1B\x61\x01'; // Center
    text += '\x1D\x21\x10'; // 2x height
    text += 'IMPRIMIR E PREPARAR\n';
    text += '\x1D\x21\x00'; // Normal

    text += '\n\n';

    // Cortar papel
    text += '\x1D\x56\x00'; // GS V 0 (partial cut)

    return text;
  };

  return {
    printState,
    openPrintModal,
    closePrintModal,
    setMethod,
    setPrinterIP,
    setPrinterPort,
    handlePrint,
    checkPrinter
  };
}
