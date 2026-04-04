export type UserStatus = 'active' | 'blocked'

export interface User {
  id: number
  fullName: string
  email: string
  status: UserStatus
  registeredAt: string
}

export interface UserListFilters {
  page: number
  limit: number
  search: string
}

export interface SaveUserPayload {
  fullName: string
  email: string
  status: UserStatus
}
