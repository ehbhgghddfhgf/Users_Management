import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useUsersStore } from '@/entities/user/model/users.store'
import type { SaveUserPayload } from '@/entities/user/model/types'
import { useValidate } from '@/shared/lib/validation/useValidate'

import type { UserFormValues, UserStatusOption } from './types'

const EMAIL_REGEXP = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const STATUS_OPTIONS: UserStatusOption[] = [
  {
    label: 'Активен',
    value: 'active',
  },
  {
    label: 'Заблокирован',
    value: 'blocked',
  },
]

function createInitialValues(): UserFormValues {
  return {
    fullName: '',
    email: '',
    status: 'active',
  }
}

export function useUserForm(options: { mode: 'create' } | { mode: 'edit'; userId: number }) {
  const router = useRouter()
  const usersStore = useUsersStore()

  const form = reactive<UserFormValues>(createInitialValues())
  const submitError = ref('')

  const { errors, resetErrors, validateField, validateForm } = useValidate<UserFormValues>({
    fullName: [
      {
        message: 'Укажите ФИО',
        validate: (value) => value.trim().length > 0,
      },
    ],
    email: [
      {
        message: 'Укажите email',
        validate: (value) => value.trim().length > 0,
      },
      {
        message: 'Введите корректный email',
        validate: (value) => EMAIL_REGEXP.test(value.trim()),
      },
    ],
    status: [
      {
        message: 'Выберите статус',
        validate: (value) => value === 'active' || value === 'blocked',
      },
    ],
  })

  const pageTitle = computed(() =>
    options.mode === 'create' ? 'Создание пользователя' : 'Редактирование пользователя',
  )
  const pageLead = computed(() =>
    options.mode === 'create'
      ? 'Новый пользователь добавляется через общую форму с переиспользуемой валидацией.'
      : 'Данные пользователя подгружаются в форму и сохраняются без дублирования логики.',
  )
  const submitLabel = computed(() =>
    options.mode === 'create' ? 'Создать пользователя' : 'Сохранить изменения',
  )
  const isEditMode = computed(() => options.mode === 'edit')

  function syncForm(payload: SaveUserPayload): void {
    form.fullName = payload.fullName
    form.email = payload.email
    form.status = payload.status
  }

  async function init(): Promise<void> {
    submitError.value = ''
    resetErrors()

    if (options.mode === 'create') {
      syncForm(createInitialValues())
      usersStore.clearCurrentUser()
      return
    }

    try {
      const user = await usersStore.fetchUser(options.userId)
      syncForm({
        fullName: user.fullName,
        email: user.email,
        status: user.status,
      })
    } catch {
      submitError.value = 'Не удалось загрузить пользователя.'
    }
  }

  async function submit(): Promise<void> {
    submitError.value = ''

    const payload: SaveUserPayload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      status: form.status,
    }

    if (!validateForm(payload)) {
      return
    }

    try {
      if (options.mode === 'create') {
        await usersStore.saveNewUser(payload)
      } else {
        await usersStore.saveExistingUser(options.userId, payload)
      }

      await router.push({ name: 'users-list' })
    } catch {
      submitError.value = 'Не удалось сохранить пользователя.'
    }
  }

  function validateSingleField(field: keyof UserFormValues): void {
    validateField(field, form)
  }

  onBeforeUnmount(() => {
    usersStore.clearCurrentUser()
  })

  return {
    errors,
    form,
    isEditMode,
    isLoading: computed(() => usersStore.isUserLoading),
    isSaving: computed(() => usersStore.isSaving),
    pageLead,
    pageTitle,
    statusOptions: STATUS_OPTIONS,
    submitError,
    submitLabel,
    init,
    submit,
    validateSingleField,
  }
}