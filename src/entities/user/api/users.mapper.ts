import type { PaginatedResult } from '@/shared/api/types'

import type { User, UserListFilters, SaveUserPayload } from '../model/types'
import type { UserDto, UsersListResponseDto } from './users.types'

export function mapUserDtoToEntity(dto: UserDto): User {
  return {
    id: dto.id,
    fullName: dto.full_name,
    email: dto.email,
    status: dto.status,
    registeredAt: dto.registered_at,
  }
}

export function mapUsersListDtoToPaginatedResult(
  dto: UsersListResponseDto,
): PaginatedResult<User> {
  return {
    items: dto.data.map(mapUserDtoToEntity),
    total: dto.meta.total,
    page: dto.meta.page,
    limit: dto.meta.limit,
  }
}

export function mapUserFiltersToQuery(filters: UserListFilters): Record<string, string | number> {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search,
  }
}

export function mapSaveUserPayloadToDto(payload: SaveUserPayload): Record<string, string> {
  return {
    full_name: payload.fullName,
    email: payload.email,
    status: payload.status,
  }
}
