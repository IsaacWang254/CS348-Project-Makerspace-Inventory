export interface Category {
  id: number
  name: string
}

export interface ComponentRecord {
  id: number
  name: string
  quantity: number
  price: number
  category_id: number
  resistance_ohms: number | null
  voltage_volts: number | null
  capacity_mah: number | null
  capacitance_farads: number | null
}

export interface CategoryResponse {
  categories: Category[]
}

export interface ComponentResponse {
  components: ComponentRecord[]
}

export interface ReportResponse {
  report: ComponentRecord[]
}

export interface ComponentFormState {
  name: string
  quantity: number
  price: number
  categoryId: string
  resistanceOhms: string
  voltageVolts: string
  capacityMah: string
  capacitanceFarads: string
}

export interface ReportFilterState {
  minQty: string
  maxQty: string
  minPrice: string
  maxPrice: string
  categoryId: string
}

export const initialFormState: ComponentFormState = {
  name: '',
  quantity: 1,
  price: 0,
  categoryId: '',
  resistanceOhms: '',
  voltageVolts: '',
  capacityMah: '',
  capacitanceFarads: '',
}

export const initialReportFilters: ReportFilterState = {
  minQty: '',
  maxQty: '',
  minPrice: '',
  maxPrice: '',
  categoryId: '',
}
