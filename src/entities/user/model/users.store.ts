import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { createUser, getUserById, getUsers, updateUser } from '../api/users.api'
import type { SaveUserPayload, User, UserListFilters } from './types'

function createInitialFilters(): UserListFilters {
  return {
    page: 1,
    limit: Number(import.meta.env.VITE_DEFAULT_PAGE_LIMIT || 40),
    search: '',
  }
}

export const useUsersStore = defineStore('users', () => {
  const filters = ref<UserListFilters>(createInitialFilters())
  const items = ref<User[]>([])
  const total = ref(0)
  const currentUser = ref<User | null>(null)

  const isListLoading = ref(false)
  const isUserLoading = ref(false)
  const isSaving = ref(false)

  const totalPages = computed(() => {
    if (total.value === 0) {
      return 1
    }

    return Math.ceil(total.value / filters.value.limit)
  })

  function setFilters(nextFilters: Partial<UserListFilters>) {
    filters.value = {
      ...filters.value,
      ...nextFilters,
    }
  }

  function resetFilters() {
    filters.value = createInitialFilters()
  }

  async function fetchUsers(customFilters?: Partial<UserListFilters>): Promise<void> {
    if (customFilters) {
      setFilters(customFilters)
    }

    isListLoading.value = true

    try {
      const result = await getUsers(filters.value)

      items.value = result.items
      total.value = result.total
      filters.value = {
        ...filters.value,
        page: result.page,
        limit: result.limit,
      }
    } finally {
      isListLoading.value = false
    }
  }

  async function fetchUser(userId: number): Promise<User> {
    isUserLoading.value = true

    try {
      const user = await getUserById(userId)
      currentUser.value = user

      return user
    } finally {
      isUserLoading.value = false
    }
  }

  async function saveNewUser(payload: SaveUserPayload): Promise<User> {
    isSaving.value = true

    try {
      const createdUser = await createUser(payload)
      currentUser.value = createdUser

      return createdUser
    } finally {
      isSaving.value = false
    }
  }

  async function saveExistingUser(userId: number, payload: SaveUserPayload): Promise<User> {
    isSaving.value = true

    try {
      const updatedUser = await updateUser(userId, payload)
      currentUser.value = updatedUser
      items.value = items.value.map((user) => (user.id === userId ? updatedUser : user))

      return updatedUser
    } finally {
      isSaving.value = false
    }
  }

  function clearCurrentUser() {
    currentUser.value = null
  }

  return {
    currentUser,
    filters,
    isListLoading,
    isSaving,
    isUserLoading,
    items,
    total,
    totalPages,
    clearCurrentUser,
    fetchUser,
    fetchUsers,
    resetFilters,
    saveExistingUser,
    saveNewUser,
    setFilters,
  }
})