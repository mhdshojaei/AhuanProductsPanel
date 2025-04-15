import { ref } from 'vue';
import { useApi } from './useApi';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  C_OR_R: string;
}

export function useProducts() {
  const products = ref<Product[]>([]);
  const { request, loading, error } = useApi();

  const fetchProducts = async () => {
    const res = await request<any[]>('/foods', 'GET', null, {
      type: 'T',
      cat: 'test',
    });
    if (res) {
      products.value = res.map((item: any) => ({
        id: item.Id,
        title: item.Title,
        description: item.Description,
        price: item.Price,
        category: item.Category,
        image: item.Image,
        C_OR_R: item.C_OR_R,
      }));
    }
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
  };
}
