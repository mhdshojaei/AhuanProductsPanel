<script setup lang="ts">
  import ProductTable from '@/components/ProductTable.vue';
  import ProductForm from '@/components/ProductForm.vue';
  import { ref } from 'vue';
  import { useProducts } from '@/composables/useProducts';

  const dialog = ref(false);
  const selected = ref(null);

  const { fetchProducts } = useProducts();

  const editProduct = (product: any) => {
    selected.value = product;
    dialog.value = true;
  };

  const createProduct = () => {
    selected.value = null;
    dialog.value = true;
  };
</script>

<template>
  <div class="container mx-auto p-4 pt-10">
    <ProductTable
      @edit="editProduct"
      @create="createProduct" />
    <ProductForm
      v-model="dialog"
      :item="selected"
      @submitted="fetchProducts" />
  </div>
</template>
