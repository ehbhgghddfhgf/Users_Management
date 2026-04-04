import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/users',
  },
  {
    path: '/users',
    name: 'users-list',
    component: () => import('@/pages/users-list/ui/UsersListPage.vue'),
  },
  {
    path: '/users/new',
    name: 'users-create',
    component: () => import('@/pages/user-form/ui/UserCreatePage.vue'),
  },
  {
    path: '/users/:id/edit',
    name: 'users-edit',
    component: () => import('@/pages/user-form/ui/UserEditPage.vue'),
    props: true,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
