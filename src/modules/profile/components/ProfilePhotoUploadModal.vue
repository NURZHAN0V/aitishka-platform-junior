<script setup>
import { ref, watch } from 'vue'
import { BaseButton, BaseFileUpload, BaseModal } from '@/core/components/ui'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  uploading: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const file = ref(null)
const error = ref('')

watch(
  () => props.modelValue,
  (open) => {
    if (!open) {
      file.value = null
      error.value = ''
    }
  },
)

function close() {
  emit('update:modelValue', false)
}

function onError(message) {
  error.value = message || ''
}

function send() {
  if (!file.value) {
    error.value = 'Выберите фото'
    return
  }
  emit('submit', file.value)
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    title="Загрузить фото"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <p class="profile-photo-upload__note">
      Учебная часть проверит фото. Пока оно на проверке, новое загрузить нельзя
    </p>
    <BaseFileUpload
      v-model="file"
      accept="image/jpeg,image/png,image/webp"
      :max-size="5 * 1024 * 1024"
      :uploading="uploading"
      @error="onError"
    />
    <p v-if="error" class="profile-photo-upload__error" role="alert">{{ error }}</p>

    <template #footer>
      <BaseButton variant="secondary" :disabled="uploading" @click="close">
        Отмена
      </BaseButton>
      <BaseButton variant="primary" :disabled="uploading || !file" @click="send">
        Отправить на проверку
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style lang="scss" scoped>
@use '@/assets/styles/tokens' as *;

.profile-photo-upload {
  &__note {
    margin: 0 0 $space-4;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: $line-height-base;
  }

  &__error {
    margin: $space-3 0 0;
    font-size: $font-size-sm;
    color: $color-error;
  }
}
</style>
