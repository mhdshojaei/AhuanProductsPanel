<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useProducts } from '@/composables/useProducts';
  import { useApi, snackbar } from '@/composables/useApi';
  import ProductForm from './ProductForm.vue';

  const { products, loading, fetchProducts } = useProducts();
  const { request } = useApi();

  const search = ref('');
  const confirmDeleteDialog = ref(false);
  const selectedToDelete = ref<any>(null);
  const showForm = ref(false);
  const selectedProduct = ref<any | null>(null);

  const headers = [
    { title: 'عنوان', key: 'title' },
    { title: 'توضیحات', key: 'description' },
    { title: 'قیمت', key: 'price' },
    { title: 'دسته‌بندی', key: 'category' },
    { title: 'تصویر', key: 'image' },
    { title: 'عملیات', key: 'actions', sortable: false },
  ];

  const deleteProduct = (item: any) => {
    selectedToDelete.value = item;
    confirmDeleteDialog.value = true;
  };

  const handleDelete = async () => {
    const id = selectedToDelete.value?.id;
    if (!id) return;

    const res = await request(`/foods?id=${id}`, 'DELETE');
    if (res !== null) {
      snackbar.value = {
        show: true,
        color: 'success',
        text: 'محصول با موفقیت حذف شد',
      };
      confirmDeleteDialog.value = false;
      await fetchProducts();
    }
  };

  const createProduct = () => {
    selectedProduct.value = null;
    showForm.value = true;
  };

  const editProduct = (item: any) => {
    selectedProduct.value = item;
    showForm.value = true;
  };

  onMounted(fetchProducts);
</script>

<template>
  <v-container>
    <!-- دیالوگ تأیید حذف -->
    <v-dialog
      v-model="confirmDeleteDialog"
      max-width="400">
      <v-card>
        <v-card-title class="text-h6">آیا مطمئنید؟</v-card-title>
        <v-card-text
          >محصول "{{ selectedToDelete?.title }}" حذف شود؟</v-card-text
        >
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="confirmDeleteDialog = false"
            >لغو</v-btn
          >
          <v-btn
            color="red"
            @click="handleDelete"
            >حذف</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- لودینگ -->
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
      class="mb-4" />

    <!-- جدول -->
    <v-data-table
      :headers="headers"
      :items="products"
      :search="search"
      item-value="id"
      class="elevation-1">
      <template #top>
        <div class="d-flex justify-space-between align-center mb-4">
          <v-text-field
            v-model="search"
            label="جستجو بر اساس عنوان"
            append-inner-icon="mdi-magnify"
            hide-details
            class="w-75" />
          <v-btn
            color="primary"
            @click="createProduct">
            <v-icon
              start
              icon="mdi-plus" />
            افزودن محصول جدید
          </v-btn>
        </div>
      </template>

      <template #[`item.actions`]="{ item }">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              icon
              v-bind="props">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="editProduct(item)">
              <v-list-item-title>
                <v-icon
                  start
                  icon="mdi-pencil"
                  class="me-2" />
                ویرایش
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="deleteProduct(item)">
              <v-list-item-title>
                <v-icon
                  start
                  icon="mdi-delete"
                  class="me-2" />
                حذف
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- فرم ساخت/ویرایش -->
    <ProductForm
      v-model="showForm"
      :item="selectedProduct"
      @submitted="fetchProducts" />
  </v-container>
</template>
