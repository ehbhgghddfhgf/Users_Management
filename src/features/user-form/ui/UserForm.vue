<script setup lang="ts">
import type { UserFormValues, UserStatusOption } from '@/features/user-form/model/types'

const model = defineModel<UserFormValues>({ required: true })

const props = defineProps<{
  errors: Partial<Record<keyof UserFormValues, string[]>>
  isLoading: boolean
  isSaving: boolean
  isEditMode: boolean
  statusOptions: UserStatusOption[]
  submitError: string
  submitLabel: string
}>()

const emit = defineEmits<{
  blurField: [field: keyof UserFormValues]
  submit: []
}>()

function blurField(field: keyof UserFormValues) {
  emit('blurField', field)
}
</script>

<template>
  <section class="user-form" aria-labelledby="user-form-title">
    <div v-if="isLoading" class="user-form__state">Загружаем данные пользователя...</div>

    <form v-else class="user-form__body" @submit.prevent="emit('submit')">
      <div class="user-form__grid">
        <label class="user-form__field">
          <span class="user-form__label">ФИО</span>
          <input
            v-model="model.fullName"
            class="user-form__control"
            type="text"
            name="fullName"
            autocomplete="name"
            placeholder="Например, Анна Петрова"
            @blur="blurField('fullName')"
          />
          <span v-if="props.errors.fullName?.length" class="user-form__error">
            {{ props.errors.fullName[0] }}
          </span>
        </label>

        <label class="user-form__field">
          <span class="user-form__label">Email</span>
          <input
            v-model="model.email"
            class="user-form__control"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="anna@example.com"
            @blur="blurField('email')"
          />
          <span v-if="props.errors.email?.length" class="user-form__error">
            {{ props.errors.email[0] }}
          </span>
        </label>

        <label class="user-form__field">
          <span class="user-form__label">Статус</span>
          <select
            v-model="model.status"
            class="user-form__control user-form__control--select"
            name="status"
            @blur="blurField('status')"
          >
            <option v-for="option in props.statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
          <span v-if="props.errors.status?.length" class="user-form__error">
            {{ props.errors.status[0] }}
          </span>
        </label>
      </div>

      <p v-if="props.submitError" class="user-form__submit-error">{{ props.submitError }}</p>

      <div class="user-form__actions">
        <RouterLink class="button-rect user-form__secondary" :to="{ name: 'users-list' }">
          К списку
        </RouterLink>

        <button class="button-rect user-form__primary" type="submit" :disabled="props.isSaving">
          {{ props.isSaving ? 'Сохраняем...' : props.submitLabel }}
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.user-form {
  min-width: 0;
  border: 1px solid var(--color-line);
  background: rgba(255, 252, 246, 0.94);
  padding: 24px;

  &__state {
    color: var(--color-ink-soft);
  }

  &__body {
    display: grid;
    gap: 20px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px 20px;
  }

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &__label {
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  &__control {
    width: 100%;
    height: 48px;
    padding: 10px 14px;
    border: 1px solid var(--color-line);
    background-color: #fffdf8;
    color: var(--color-ink);
  }

  &__control--select {
    appearance: none;
  }

  &__error,
  &__submit-error {
    color: #8b3d32;
    font-size: 0.9rem;
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
  }

  &__primary,
  &__secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    min-height: 44px;
    padding: 0 18px;
    border: 1px solid var(--color-ink);
    font-size: 0.95rem;
    font-weight: 700;
  }

  &__primary {
    background: linear-gradient(180deg, #8c6640 0%, #6f4d2d 100%);
    color: #fff7ea;
  }

  &__secondary {
    background: transparent;
    color: var(--color-ink);
  }

  @media (max-width: 768px) {
    &__grid {
      grid-template-columns: 1fr;
    }

    &__actions {
      display: grid;
      grid-template-columns: 1fr;
    }

    &__primary,
    &__secondary {
      width: 100%;
    }
  }
}
</style>