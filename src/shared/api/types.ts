export interface PaginatedResult<TItem> {
  items: TItem[]
  total: number
  page: number
  limit: number
}
