import type { SaveUserPayload, UserStatus } from '@/entities/user/model/types'

export interface UserFormValues extends SaveUserPayload {}

export interface UserStatusOption {
  label: string
  value: UserStatus
}