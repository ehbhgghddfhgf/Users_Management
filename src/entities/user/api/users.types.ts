import type { UserStatus } from '../model/types'

export interface UserDto {
  id: number
  full_name: string
  email: string
  status: UserStatus
  registered_at: string
}

export interface UsersListResponseDto {
  data: UserDto[]
  meta: {
    total: number
    page: number
    limit: number
  }
}
