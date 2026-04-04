<script setup lang="ts">
import { useUsersStore } from '@/entities/user/model/users.store';

</script>

<template>
  <main class="page-shell">
    {{ useUsersStore().filters }}
    <div class="page-shell__inner">
      <header class="page-shell__header">
        <h1 class="page-shell__title">Список пользователей</h1>
        <p class="page-shell__lead">
          Список
        </p>
      </header>
    </div>
  </main>
</template>
