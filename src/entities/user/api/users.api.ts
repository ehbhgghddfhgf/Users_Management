import type { PaginatedResult } from '@/shared/api/types'
import { http } from '@/shared/api/http'

import type { SaveUserPayload, User, UserListFilters } from '../model/types'
import {
  mapSaveUserPayloadToDto,
  mapUserDtoToEntity,
  mapUserFiltersToQuery,
  mapUsersListDtoToPaginatedResult,
} from './users.mapper'
import type { UserDto, UsersListResponseDto } from './users.types'

export async function getUsers(filters: UserListFilters): Promise<PaginatedResult<User>> {
  const response = await http.get<UsersListResponseDto>('/users', {
    params: mapUserFiltersToQuery(filters),
  })

  return mapUsersListDtoToPaginatedResult(response.data)
}

export async function getUserById(userId: number): Promise<User> {
  const response = await http.get<UserDto>(`/users/${userId}`)

  return mapUserDtoToEntity(response.data)
}

export async function createUser(payload: SaveUserPayload): Promise<User> {
  const response = await http.post<UserDto>('/users', mapSaveUserPayloadToDto(payload))

  return mapUserDtoToEntity(response.data)
}

export async function updateUser(userId: number, payload: SaveUserPayload): Promise<User> {
  const response = await http.patch<UserDto>(`/users/${userId}`, mapSaveUserPayloadToDto(payload))

  return mapUserDtoToEntity(response.data)
}
