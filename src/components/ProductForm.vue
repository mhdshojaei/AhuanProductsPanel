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

  const rawPriceInput = ref('');

  watch(
    () => form.price,
    (val) => {
      rawPriceInput.value = val ? String(val) : '';
    },
  );

  const handlePriceInput = (value: string) => {
    if (!/^\d*$/.test(value)) return;

    rawPriceInput.value = value;
    form.price = parseInt(value) || 0;
  };

  const formatPriceOnBlur = () => {
    if (form.price) {
      rawPriceInput.value = new Intl.NumberFormat('fa-IR').format(form.price);
    }
  };
  const onlyAllowDigits = (e: KeyboardEvent) => {
    const allowedKeys = [
      'Backspace',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Tab',
    ];
    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  const showRawPriceOnFocus = () => {
    rawPriceInput.value = String(form.price || '');
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
    const { valid } = await formRef.value.validate();
    if (!valid) return;
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
    @update:modelValue="(val) => emit('update:modelValue', val)"
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
            :model-value="rawPriceInput"
            @update:model-value="handlePriceInput"
            @keypress="onlyAllowDigits"
            @blur="formatPriceOnBlur"
            @focus="showRawPriceOnFocus"
            label="قیمت"
            suffix="تومان"
            type="text"
            :rules="[rules.required]"
            dir="rtl" />

          <v-text-field
            v-model="form.image"
            label="آدرس تصویر"
            :rules="[rules.required, rules.maxImage]" />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />

        <v-btn
          class="!rounded-lg"
          color="error"
          variant="elevated"
          @click="close">
          بستن
        </v-btn>

        <v-btn
          class="!rounded-lg"
          color="primary"
          variant="flat"
          @click="handleSubmit">
          {{ isEdit ? 'ویرایش' : 'ثبت' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
