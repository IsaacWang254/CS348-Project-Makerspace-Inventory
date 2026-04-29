import type {
  CategoryResponse,
  ComponentResponse,
  ReportFilterState,
  ReportResponse,
} from '../types/inventory'

async function parseJson<T>(response: Response, fallbackError: string): Promise<T> {
  if (!response.ok) {
    throw new Error(fallbackError)
  }

  return (await response.json()) as T
}

export async function fetchCategories(): Promise<CategoryResponse> {
  const response = await fetch('/api/categories')
  return parseJson<CategoryResponse>(response, 'Failed to load categories')
}

export async function fetchComponents(): Promise<ComponentResponse> {
  const response = await fetch('/api/components')
  return parseJson<ComponentResponse>(response, 'Failed to load components')
}

export async function createComponent(payload: {
  name: string
  quantity: number
  price: number
  category_id: number
  resistance_ohms?: number
  voltage_volts?: number
  capacity_mah?: number
  capacitance_farads?: number
}): Promise<void> {
  const response = await fetch('/api/components', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  await parseJson<{ message: string }>(response, 'Failed to create component')
}

export async function updateComponent(payload: {
  id: number
  name: string
  quantity: number
  price: number
  category_id: number
  resistance_ohms?: number
  voltage_volts?: number
  capacity_mah?: number
  capacitance_farads?: number
}): Promise<void> {
  const response = await fetch('/api/components', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  await parseJson<{ message: string }>(response, 'Failed to update component')
}

export async function deleteComponent(id: number): Promise<void> {
  const response = await fetch('/api/components', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  await parseJson<{ message: string }>(response, 'Failed to delete component')
}

export async function fetchReport(filters: ReportFilterState): Promise<ReportResponse> {
  const params = new URLSearchParams()
  if (filters.minQty !== '') params.set('min_qty', filters.minQty)
  if (filters.maxQty !== '') params.set('max_qty', filters.maxQty)
  if (filters.minPrice !== '') params.set('min_price', filters.minPrice)
  if (filters.maxPrice !== '') params.set('max_price', filters.maxPrice)
  if (filters.categoryId !== '') params.set('category_id', filters.categoryId)

  const response = await fetch(`/api/components/report?${params.toString()}`)
  return parseJson<ReportResponse>(response, 'Failed to run report')
}
