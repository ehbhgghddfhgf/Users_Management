<script setup lang="ts">
import { RouterView } from 'vue-router'

const companyName = import.meta.env.VITE_COMPANY_NAME || 'Company Name'
</script>

<template>
  <div class="app-shell">
    <RouterView />

    <footer class="app-footer">
      <div class="app-footer__inner">
        <p class="app-footer__copy">© 2026 {{ companyName }}</p>
      </div>
    </footer>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-footer {
  padding: 0 20px 28px;

  &__inner {
    width: min(100%, var(--page-max-width));
    margin: 0 auto;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
  }

  &__copy {
    margin: 0;
    color: var(--color-ink-soft);
    font-size: 0.88rem;
    text-align: right;
  }

  @media (max-width: 768px) {
    padding: 0 12px 20px;

    &__copy {
      text-align: left;
    }
  }
}
</style>