<script setup lang="ts">
import { computed } from 'vue'

import type { UserStatus } from '@/entities/user/model/types'
import { useUsersListPage } from '@/pages/users-list/model/useUsersListPage'

const {
  filters,
  goToPage,
  hasRows,
  isFirstPage,
  isLastPage,
  isListLoading,
  searchDraft,
  submitSearch,
  tableRows,
  total,
  totalPages,
  visibleFrom,
  visibleTo,
} = useUsersListPage()

const statusLabels: Record<UserStatus, string> = {
  active: 'Активен',
  blocked: 'Заблокирован',
}

const statusClasses: Record<UserStatus, string> = {
  active: 'users-index__status users-index__status--active',
  blocked: 'users-index__status users-index__status--blocked',
}

const paginationCaption = computed(() => {
  if (!total.value) {
    return 'Пользователи не найдены'
  }

  return `Показаны записи ${visibleFrom.value}-${visibleTo.value} из ${total.value}`
})

function formatRegistrationDate(value: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}
</script>

<template>
  <main class="page-shell users-index">
    <div class="page-shell__inner users-index__inner">
      <header class="page-shell__header users-index__header">
        <h1 class="page-shell__title">Список пользователей</h1>

        <RouterLink class="users-index__create-link" :to="{ name: 'users-create' }">
          Добавить пользователя
        </RouterLink>
      </header>

      <section class="users-index__panel" aria-labelledby="users-search-title">
        <div class="users-index__panel-head">
          <h2 id="users-search-title" class="users-index__panel-title">Поиск</h2>
          <p class="users-index__panel-note">{{ paginationCaption }}</p>
        </div>

        <form class="users-index__search" @submit.prevent="submitSearch">
          <label class="users-index__field">
            <span class="users-index__field-label">Имя или email</span>
            <input
              v-model="searchDraft"
              class="users-index__input"
              type="search"
              name="search"
              placeholder="Например, hr@simourg.com"
            />
          </label>

          <button class="users-index__submit" type="submit" :disabled="isListLoading">
            Найти
          </button>
        </form>
      </section>

      <section class="users-index__panel" aria-labelledby="users-table-title">
        <div class="users-index__panel-head">
          <h2 id="users-table-title" class="users-index__panel-title">Пользователи</h2>
          <p class="users-index__panel-note">Страница {{ filters.page }} из {{ totalPages }}</p>
        </div>

        <div class="users-index__table-wrap">
          <table class="users-index__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Email</th>
                <th>Дата регистрации</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody v-if="hasRows">
              <tr v-for="user in tableRows" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.fullName }}</td>
                <td>
                  <a class="users-index__email" :href="`mailto:${user.email}`">{{ user.email }}</a>
                </td>
                <td>{{ formatRegistrationDate(user.registeredAt) }}</td>
                <td>
                  <span :class="statusClasses[user.status]">{{ statusLabels[user.status] }}</span>
                </td>
                <td>
                  <RouterLink
                    class="users-index__edit-link"
                    :to="{ name: 'users-edit', params: { id: user.id } }"
                  >
                    Редактировать
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!hasRows && !isListLoading" class="users-index__empty">
            По вашему запросу ничего не найдено.
          </div>

          <div v-if="isListLoading" class="users-index__loading">Загружаем список...</div>
        </div>

        <footer class="users-index__footer">
          <button
            class="users-index__pager-button"
            type="button"
            :disabled="isListLoading || isFirstPage"
            @click="goToPage(filters.page - 1)"
          >
            Назад
          </button>

          <span class="users-index__pager-indicator">
            {{ filters.page }} / {{ totalPages }}
          </span>

          <button
            class="users-index__pager-button"
            type="button"
            :disabled="isListLoading || isLastPage"
            @click="goToPage(filters.page + 1)"
          >
            Вперед
          </button>
        </footer>
      </section>
    </div>
  </main>
</template>

<style scoped lang="scss">
.users-index {
  &__inner {
    display: grid;
    gap: 24px;
  }

  &__header {
    display: flex;
    width: 100%;
    max-width: none;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  &__create-link,
  &__submit,
  &__pager-button,
  &__edit-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    border: 1px solid var(--color-ink);
    background: linear-gradient(180deg, #5d7c73 0%, #466c63 100%);
    color: #f4f7f4;
    padding: 0 18px;
    font-size: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    cursor: pointer;
    transition: transform 0.16s ease, background-color 0.16s ease;
  }

  &__create-link:hover,
  &__submit:hover,
  &__pager-button:hover,
  &__edit-link:hover {
    transform: translateY(-1px);
  }

  &__create-link:disabled,
  &__submit:disabled,
  &__pager-button:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }

  &__panel {
    min-width: 0;
    border: 1px solid var(--color-line);
    background: rgba(248, 251, 247, 0.92);
    padding: 20px;
  }

  &__panel-head {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    margin-bottom: 16px;
  }

  &__panel-title {
    margin: 0;
    font-family: var(--font-heading);
    font-size: 1.45rem;
  }

  &__panel-note {
    margin: 0;
    color: var(--color-ink-soft);
    font-size: 0.95rem;
  }

  &__search {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 16px;
    align-items: end;
  }

  &__field {
    display: grid;
    gap: 8px;
    min-width: 0;
  }

  &__field-label {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-ink-soft);
  }

  &__input {
    width: 100%;
    min-height: 48px;
    padding: 10px 14px;
    border: 1px solid var(--color-line);
    background-color: #fcfefc;
    color: var(--color-ink);
  }

  &__table-wrap {
    position: relative;
    display: block;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    overflow-x: auto;
    overflow-y: hidden;
    border: 1px solid var(--color-line);
    background-color: #fcfefc;
    -webkit-overflow-scrolling: touch;
    scrollbar-gutter: stable both-edges;
  }

  &__table {
    width: 100%;
    min-width: 860px;
    border-collapse: collapse;
  }

  &__table th,
  &__table td {
    padding: 14px 16px;
    border-bottom: 1px solid #d6ddd4;
    text-align: left;
    vertical-align: top;
  }

  &__table th {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--color-ink-soft);
    background-color: #e4ebe2;
  }

  &__email {
    text-decoration: underline;
    text-underline-offset: 2px;
    overflow-wrap: anywhere;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    min-height: 30px;
    padding: 0 10px;
    border: 1px solid currentColor;
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }

  &__status--active {
    color: #2d5f3c;
    background-color: #ebf4eb;
  }

  &__status--blocked {
    color: #7a3c33;
    background-color: #f8ebe6;
  }

  &__edit-link {
    min-height: 36px;
    padding: 0 12px;
    font-size: 0.85rem;
    white-space: nowrap;
  }

  &__empty,
  &__loading {
    padding: 24px 16px;
    color: var(--color-ink-soft);
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 18px;
  }

  &__pager-indicator {
    min-width: 72px;
    text-align: center;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    &__header,
    &__panel-head,
    &__search,
    &__footer {
      display: grid;
      grid-template-columns: 1fr;
      align-items: stretch;
    }

    &__header,
    &__panel-head,
    &__footer {
      gap: 12px;
    }

    &__panel {
      padding: 16px;
    }

    &__panel-note,
    &__pager-indicator {
      text-align: left;
    }

    &__create-link,
    &__submit,
    &__pager-button {
      width: 100%;
    }

    &__table-wrap {
      margin: 0 -16px;
      padding: 0 16px 8px;
      border-left: 0;
      border-right: 0;
    }

    &__table {
      width: max-content;
      min-width: 860px;
    }
  }
}
</style>