<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useUserForm } from '@/features/user-form/model/useUserForm'
import UserForm from '@/features/user-form/ui/UserForm.vue'

const route = useRoute()
const userId = Number(route.params.id)

const {
  errors,
  form,
  init,
  isEditMode,
  isLoading,
  isSaving,
  pageLead,
  pageTitle,
  statusOptions,
  submit,
  submitError,
  submitLabel,
  validateSingleField,
} = useUserForm({ mode: 'edit', userId })

onMounted(() => {
  void init()
})
</script>

<template>
  <main class="page-shell">
    <div class="page-shell__inner user-form-page">
      <header class="page-shell__header user-form-page__header">
        <h1 class="page-shell__title">{{ pageTitle }}</h1>
        <p class="page-shell__lead">{{ pageLead }}</p>
      </header>

      <UserForm
        v-model="form"
        :errors="errors"
        :is-edit-mode="isEditMode"
        :is-loading="isLoading"
        :is-saving="isSaving"
        :status-options="statusOptions"
        :submit-error="submitError"
        :submit-label="submitLabel"
        @blur-field="validateSingleField"
        @submit="submit"
      />
    </div>
  </main>
</template>

<style scoped lang="scss">
.user-form-page {
  display: grid;
  gap: 24px;

  &__header {
    width: 100%;
    max-width: none;
  }
}
</style>