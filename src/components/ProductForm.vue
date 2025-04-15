<script setup lang="ts">
  import { ref, watch, reactive } from 'vue';
  import { useApi, snackbar } from '@/composables/useApi';

  const props = defineProps<{
    modelValue: boolean;
    item?: any;
  }>();
  const emit = defineEmits(['update:modelValue', 'submitted']);

  const dialog = ref(false);
  const isEdit = ref(false);
  const formRef = ref();
  const { request } = useApi();

  const form = reactive({
    title: '',
    description: '',
    price: 0,
    image: '',
  });

  const rules = {
    required: (v: any) => !!v || 'این فیلد الزامی است',
    maxImage: (v: string) => v.length <= 50 || 'حداکثر ۵۰ کاراکتر مجاز است',
  };

  watch(
    () => props.modelValue,
    (val) => {
      dialog.value = val;
      if (val) {
        isEdit.value = !!props.item;
        if (isEdit.value) {
          Object.assign(form, { ...props.item });
        } else {
          Object.assign(form, {
            title: '',
            description: '',
            price: 0,
            image: '',
          });
        }
      }
    },
  );

  const close = () => {
    dialog.value = false;
    emit('update:modelValue', false);
  };

  const handleSubmit = async () => {
    if (!(await formRef.value.validate())) return;

    const payload = {
      ...form,
      C_OR_R: 'T',
      category: 'test',
    };

    const res = isEdit.value
      ? await request(`/foods?id=${props.item.id}`, 'PUT', payload)
      : await request('/foods', 'POST', payload);

    if (res) {
      snackbar.value = {
        show: true,
        color: 'success',
        text: isEdit.value
          ? 'محصول با موفقیت ویرایش شد'
          : 'محصول با موفقیت ثبت شد',
      };
      close();
      emit('submitted');
    }
  };
</script>

<template>
  <v-dialog
    v-model="dialog"
    max-width="600">
    <v-card>
      <v-card-title class="text-h6">
        {{ isEdit ? 'ویرایش محصول' : 'افزودن محصول' }}
      </v-card-title>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.title"
            label="عنوان"
            :rules="[rules.required]" />
          <v-text-field
            v-model="form.description"
            label="توضیحات"
            :rules="[rules.required]" />
          <v-text-field
            v-model="form.price"
            label="قیمت"
            type="number"
            :rules="[rules.required]" />
          <v-text-field
            v-model="form.image"
            label="آدرس تصویر"
            :rules="[rules.required, rules.maxImage]" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          @click="close"
          >بستن</v-btn
        >
        <v-btn
          color="primary"
          @click="handleSubmit">
          {{ isEdit ? 'ویرایش' : 'ثبت' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
