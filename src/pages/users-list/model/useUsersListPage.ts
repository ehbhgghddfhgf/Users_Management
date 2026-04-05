import { storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useUsersStore } from '@/entities/user/model/users.store'

function parsePositiveInt(value: unknown, fallback: number): number {
  const parsedValue = Number(value)

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    return fallback
  }

  return parsedValue
}

function parseSearch(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

export function useUsersListPage() {
  const router = useRouter()
  const route = useRoute()
  const usersStore = useUsersStore()
  const { filters, isListLoading, items, total, totalPages } = storeToRefs(usersStore)

  const searchDraft = ref('')
  const defaultPageLimit = Number(import.meta.env.VITE_DEFAULT_PAGE_LIMIT || 40)

  const tableRows = computed(() => items.value)
  const hasRows = computed(() => tableRows.value.length > 0)
  const isFirstPage = computed(() => filters.value.page <= 1)
  const isLastPage = computed(() => filters.value.page >= totalPages.value)
  const visibleFrom = computed(() => {
    if (total.value === 0) {
      return 0
    }

    return (filters.value.page - 1) * filters.value.limit + 1
  })
  const visibleTo = computed(() => Math.min(filters.value.page * filters.value.limit, total.value))

  async function syncFromRoute() {
    const nextPage = parsePositiveInt(route.query.page, 1)
    const nextLimit = parsePositiveInt(route.query.limit, defaultPageLimit)
    const nextSearch = parseSearch(route.query.search)

    searchDraft.value = nextSearch

    const normalizedQuery = {
      page: String(nextPage),
      limit: String(nextLimit),
      ...(nextSearch ? { search: nextSearch } : {}),
    }

    const currentQuery = {
      ...route.query,
    }

    if (
      currentQuery.page !== normalizedQuery.page ||
      currentQuery.limit !== normalizedQuery.limit ||
      (currentQuery.search ?? '') !== (normalizedQuery.search ?? '') ||
      Object.keys(currentQuery).some((key) => !['page', 'limit', 'search'].includes(key))
    ) {
      await router.replace({ query: normalizedQuery })
      return
    }

    await usersStore.fetchUsers({
      page: nextPage,
      limit: nextLimit,
      search: nextSearch,
    })
  }

  async function updateQuery(nextPage: number) {
    await router.push({
      query: {
        page: String(nextPage),
        limit: String(filters.value.limit),
        ...(searchDraft.value.trim() ? { search: searchDraft.value.trim() } : {}),
      },
    })
  }

  async function submitSearch() {
    await updateQuery(1)
  }

  async function goToPage(page: number) {
    if (page < 1 || page > totalPages.value || page === filters.value.page) {
      return
    }

    await updateQuery(page)
  }

  watch(
    () => route.query,
    () => {
      void syncFromRoute()
    },
    {
      immediate: true,
    },
  )

  return {
    filters,
    hasRows,
    isFirstPage,
    isLastPage,
    isListLoading,
    searchDraft,
    tableRows,
    total,
    totalPages,
    visibleFrom,
    visibleTo,
    goToPage,
    submitSearch,
  }
}