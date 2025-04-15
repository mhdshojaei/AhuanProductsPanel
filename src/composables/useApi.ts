import axios from 'axios';
import { ref } from 'vue';

const BASE_URL = 'https://ahuan.ir/api';

export const snackbar = ref<{
  show: boolean;
  color: string;
  text: string;
}>({
  show: false,
  color: '',
  text: '',
});

export function useApi() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const request = async <T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    data?: any,
    params?: any,
  ): Promise<T | {} | null> => {
    loading.value = true;
    error.value = null;

    try {
      const response = await axios.request<T>({
        method,
        url: `${BASE_URL}${url}`,
        data,
        params,
        headers: {
          Accept: 'application/json',
        },
      });

      if (response.status === 204) {
        return {};
      }

      return response.data;
    } catch (err: any) {
      error.value =
        err?.response?.data?.message ||
        'خطایی رخ داده لطفا با پشتیبانی تماس بگیرید.';

      snackbar.value = {
        show: true,
        color: 'error',
        text: error.value ?? 'خطای نامشخص',
      };

      return null;
    } finally {
      loading.value = false;
    }
  };

  return {
    request,
    loading,
    error,
  };
}
