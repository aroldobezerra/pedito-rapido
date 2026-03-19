import { supabase } from './supabaseClient';
import { Store, Order, Product } from '../types';

/**
 * STORES - Funções para gerenciar lanchonetes
 */
export const storesService = {
  // Criar nova lanchonete
  async create(store: Store) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .insert([
          {
            id: store.id,
            name: store.name,
            slug: store.slug,
            whatsapp: store.whatsapp,
            adminPassword: store.adminPassword,
            createdAt: new Date(store.createdAt).toISOString(),
            isOpen: store.isOpen,
            categoriesJson: JSON.stringify(store.categories || []),
            updatedAt: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar lanchonete:', error);
      return { success: false, error };
    }
  },

  // Buscar todas as lanchonetes
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      // Converter JSON strings de volta para objetos
      const stores = data?.map((store: any) => ({
        ...store,
        categories: store.categoriesJson ? JSON.parse(store.categoriesJson) : [],
        createdAt: new Date(store.createdAt).getTime(),
      })) || [];

      return { success: true, data: stores };
    } catch (error) {
      console.error('Erro ao buscar lanchonetes:', error);
      return { success: false, error };
    }
  },

  // Buscar lanchonete por slug
  async getBySlug(slug: string) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('slug', slug.toLowerCase())
        .single();

      if (error) throw error;

      const store = {
        ...data,
        categories: data?.categoriesJson ? JSON.parse(data.categoriesJson) : [],
        createdAt: new Date(data.createdAt).getTime(),
      };

      return { success: true, data: store };
    } catch (error) {
      console.error('Erro ao buscar lanchonete por slug:', error);
      return { success: false, error };
    }
  },

  // Atualizar lanchonete
  async update(storeId: string, updates: Partial<Store>) {
    try {
      const { data, error } = await supabase
        .from('stores')
        .update({
          ...updates,
          categoriesJson: updates.categories ? JSON.stringify(updates.categories) : undefined,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', storeId)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar lanchonete:', error);
      return { success: false, error };
    }
  },

  // Deletar lanchonete
  async delete(storeId: string) {
    try {
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar lanchonete:', error);
      return { success: false, error };
    }
  },
};

/**
 * ORDERS - Funções para gerenciar pedidos
 */
export const ordersService = {
  // Criar novo pedido
  async create(order: Order) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([
          {
            id: order.id,
            storeId: order.store_id,
            customerName: order.customerName,
            address: order.address || null,
            deliveryMethod: order.deliveryMethod,
            tableNumber: order.tableNumber || null,
            pickupTime: order.pickupTime || null,
            status: order.status,
            itemsJson: JSON.stringify(order.items),
            total: order.total,
            notes: order.notes || null,
            timestamp: new Date(order.timestamp).toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return { success: false, error };
    }
  },

  // Buscar pedidos de uma lanchonete
  async getByStore(storeId: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('storeId', storeId)
        .order('timestamp', { ascending: false });

      if (error) throw error;

      const orders = data?.map((order: any) => ({
        id: order.id,
        store_id: order.storeId,
        customerName: order.customerName,
        address: order.address,
        deliveryMethod: order.deliveryMethod,
        tableNumber: order.tableNumber,
        pickupTime: order.pickupTime,
        status: order.status,
        items: JSON.parse(order.itemsJson),
        total: order.total,
        notes: order.notes,
        timestamp: order.timestamp,
        estimatedArrival: order.estimatedArrival || '',
      })) || [];

      return { success: true, data: orders };
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return { success: false, error };
    }
  },

  // Atualizar status do pedido
  async updateStatus(orderId: string, status: string) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return { success: false, error };
    }
  },
};

/**
 * PRODUCTS - Funções para gerenciar produtos
 */
export const productsService = {
  // Criar novo produto
  async create(product: Product) {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            id: product.id,
            storeId: '', // Será preenchido quando integrado ao store
            name: product.name,
            price: product.price,
            category: product.category.toString(),
            description: product.description,
            imageUrl: product.image,
            isAvailable: product.isAvailable,
            extrasJson: JSON.stringify(product.extras || []),
            createdAt: new Date().toISOString(),
          },
        ])
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return { success: false, error };
    }
  },

  // Buscar produtos de uma lanchonete
  async getByStore(storeId: string) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('storeId', storeId)
        .order('createdAt', { ascending: false });

      if (error) throw error;

      const products = data?.map((product: any) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        image: product.imageUrl,
        isAvailable: product.isAvailable,
        extras: product.extrasJson ? JSON.parse(product.extrasJson) : [],
        trackInventory: false,
      })) || [];

      return { success: true, data: products };
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return { success: false, error };
    }
  },

  // Atualizar produto
  async update(productId: string, updates: Partial<Product>) {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          price: updates.price,
          category: updates.category?.toString(),
          description: updates.description,
          imageUrl: updates.image,
          isAvailable: updates.isAvailable,
          extrasJson: updates.extras ? JSON.stringify(updates.extras) : undefined,
        })
        .eq('id', productId)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return { success: false, error };
    }
  },

  // Deletar produto
  async delete(productId: string) {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar produto:', error);
      return { success: false, error };
    }
  },
};

/**
 * Função auxiliar para sincronizar dados locais com Supabase
 */
export async function syncAllData() {
  try {
    const storesResult = await storesService.getAll();
    
    if (!storesResult.success) {
      throw new Error('Falha ao sincronizar dados');
    }

    // Buscar produtos e pedidos para cada lanchonete
    const storesWithData = await Promise.all(
      (storesResult.data || []).map(async (store: Store) => {
        const ordersResult = await ordersService.getByStore(store.id);
        const productsResult = await productsService.getByStore(store.id);

        return {
          ...store,
          orders: ordersResult.success ? ordersResult.data : [],
          products: productsResult.success ? productsResult.data : [],
        };
      })
    );

    return { success: true, data: storesWithData };
  } catch (error) {
    console.error('Erro ao sincronizar dados:', error);
    return { success: false, error };
  }
}
