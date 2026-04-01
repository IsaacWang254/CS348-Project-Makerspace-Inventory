import { useEffect, useMemo, useState } from 'react'
import {
  createComponent,
  deleteComponent,
  fetchCategories,
  fetchComponents,
  fetchReport,
  updateComponent,
} from '../api/inventoryApi'
import type {
  Category,
  ComponentFormState,
  ComponentRecord,
  ReportFilterState,
} from '../types/inventory'
import { initialFormState, initialReportFilters } from '../types/inventory'
import ComponentEditor from './ComponentEditor'
import ComponentsTable from './ComponentsTable'
import ReportPanel from './ReportPanel'

export default function ComponentForm() {
  const [categories, setCategories] = useState<Category[]>([])
  const [components, setComponents] = useState<ComponentRecord[]>([])
  const [form, setForm] = useState<ComponentFormState>(initialFormState)
  const [reportFilters, setReportFilters] = useState<ReportFilterState>(initialReportFilters)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [reportRows, setReportRows] = useState<ComponentRecord[]>([])
  const [hasActiveFilter, setHasActiveFilter] = useState<boolean>(false)
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false)
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false)
  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.name.localeCompare(b.name)),
    [categories],
  )

  async function loadCategoriesData(): Promise<void> {
    const data = await fetchCategories()
    setCategories(data.categories)
  }

  async function loadComponentsData(): Promise<void> {
    const data = await fetchComponents()
    setComponents(data.components)
  }

  useEffect(() => {
    async function loadData(): Promise<void> {
      try {
        await Promise.all([loadCategoriesData(), loadComponentsData()])
      } catch (error) {
        console.error(error)
        setErrorMessage('Failed to load data. Make sure the server is running.')
      }
    }

    void loadData()
  }, [])

  function resetForm(): void {
    setForm(initialFormState)
    setEditingId(null)
  }

  function startEdit(record: ComponentRecord): void {
    setEditingId(record.id)
    setIsAddOpen(true)
    setForm({
      name: record.name,
      quantity: record.quantity,
      price: record.price,
      categoryId: String(record.category_id),
      resistanceOhms: record.resistance_ohms?.toString() ?? '',
      voltageVolts: record.voltage_volts?.toString() ?? '',
      capacityMah: record.capacity_mah?.toString() ?? '',
      capacitanceFarads: record.capacitance_farads?.toString() ?? '',
    })
    setStatusMessage('')
    setErrorMessage('')
  }

  function openAddModal(): void {
    setIsFilterOpen(false)
    setIsAddOpen(true)
    setStatusMessage('')
    setErrorMessage('')
  }

  function openFilterModal(): void {
    setIsAddOpen(false)
    setIsFilterOpen(true)
    setStatusMessage('')
    setErrorMessage('')
  }

  function closeAddModal(): void {
    setIsAddOpen(false)
    resetForm()
  }

  function closeFilterModal(): void {
    setIsFilterOpen(false)
  }

  async function handleSubmit(): Promise<void> {
    setErrorMessage('')
    setStatusMessage('')

    if (!form.name.trim() || !form.categoryId || form.quantity < 0 || form.price < 0) {
      setErrorMessage('Enter a name, valid quantity, valid price, and category.')
      return
    }

    const selectedCategory = sortedCategories.find((category) => String(category.id) === form.categoryId)
    const selectedCategoryName = selectedCategory?.name.toLowerCase() ?? ''

    if (selectedCategoryName === 'resistors' && form.resistanceOhms.trim() === '') {
      setErrorMessage('Resistors require a resistance value.')
      return
    }
    if (
      selectedCategoryName === 'batteries' &&
      (form.voltageVolts.trim() === '' || form.capacityMah.trim() === '')
    ) {
      setErrorMessage('Batteries require both voltage and capacity.')
      return
    }
    if (selectedCategoryName === 'capacitors' && form.capacitanceFarads.trim() === '') {
      setErrorMessage('Capacitors require a capacitance value.')
      return
    }

    const payload = {
      name: form.name.trim(),
      quantity: form.quantity,
      price: form.price,
      category_id: Number(form.categoryId),
      resistance_ohms: form.resistanceOhms.trim() === '' ? undefined : Number(form.resistanceOhms),
      voltage_volts: form.voltageVolts.trim() === '' ? undefined : Number(form.voltageVolts),
      capacity_mah: form.capacityMah.trim() === '' ? undefined : Number(form.capacityMah),
      capacitance_farads: form.capacitanceFarads.trim() === '' ? undefined : Number(form.capacitanceFarads),
    }

    try {
      if (editingId === null) {
        await createComponent(payload)
      } else {
        await updateComponent({ id: editingId, ...payload })
      }

      await loadComponentsData()
      resetForm()
      setIsAddOpen(false)
      setStatusMessage(editingId === null ? 'Component added.' : 'Component updated.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Could not save component.')
    }
  }

  async function handleDelete(id: number): Promise<void> {
    setErrorMessage('')
    setStatusMessage('')
    const confirmed = window.confirm('Delete this component?')
    if (!confirmed) return

    try {
      await deleteComponent(id)

      await loadComponentsData()
      if (editingId === id) {
        resetForm()
      }
      setStatusMessage('Component deleted.')
    } catch (error) {
      console.error(error)
      setErrorMessage('Could not delete component.')
    }
  }

  async function handleRunReport(): Promise<void> {
    setErrorMessage('')
    setStatusMessage('')

    try {
      const data = await fetchReport(reportFilters)
      setReportRows(data.report)
      setHasActiveFilter(true)
      setIsFilterOpen(false)
      setStatusMessage(`Report generated with ${data.report.length} row(s).`)
    } catch (error) {
      console.error(error)
      setErrorMessage('Could not generate report.')
    }
  }

  function clearFilter(): void {
    setReportRows([])
    setHasActiveFilter(false)
    setReportFilters(initialReportFilters)
    setStatusMessage('Filter cleared.')
  }

  const isFilteredView = hasActiveFilter
  const visibleRows = isFilteredView ? reportRows : components
  const isModalOpen = isAddOpen || isFilterOpen

  return (
    <div className="inventory-panel">
      {errorMessage && <p className="message error">{errorMessage}</p>}
      {statusMessage && <p className="message success">{statusMessage}</p>}

      <ComponentsTable
        categories={sortedCategories}
        rows={visibleRows}
        onEdit={startEdit}
        onDelete={(id) => void handleDelete(id)}
        onToggleAdd={openAddModal}
        onToggleFilter={openFilterModal}
        isAddOpen={isAddOpen}
        isFilterOpen={isFilterOpen}
        isFilteredView={isFilteredView}
        onClearFilter={clearFilter}
        interactionsDisabled={isModalOpen}
      />

      {isModalOpen && <div className="modal-backdrop" />}

      {isAddOpen && (
        <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Add Component">
          <ComponentEditor
            form={form}
            categories={sortedCategories}
            isEditing={editingId !== null}
            onChange={(nextForm) => {
              if (nextForm.categoryId !== form.categoryId) {
                setForm({
                  ...nextForm,
                  resistanceOhms: '',
                  voltageVolts: '',
                  capacityMah: '',
                  capacitanceFarads: '',
                })
                return
              }
              setForm(nextForm)
            }}
            onSubmit={() => void handleSubmit()}
            onClose={closeAddModal}
          />
        </div>
      )}

      {isFilterOpen && (
        <div className="modal-shell" role="dialog" aria-modal="true" aria-label="Filter Components">
          <ReportPanel
            filters={reportFilters}
            categories={sortedCategories}
            onChangeFilters={setReportFilters}
            onRunReport={() => void handleRunReport()}
            onClose={closeFilterModal}
          />
        </div>
      )}
    </div>
  )
}