import type { Category, ComponentRecord } from '../types/inventory'

interface ComponentsTableProps {
  categories: Category[]
  rows: ComponentRecord[]
  onEdit: (component: ComponentRecord) => void
  onDelete: (id: number) => void
  onToggleAdd: () => void
  onToggleFilter: () => void
  isAddOpen: boolean
  isFilterOpen: boolean
  isFilteredView: boolean
  onClearFilter: () => void
  interactionsDisabled: boolean
}

export default function ComponentsTable({
  categories,
  rows,
  onEdit,
  onDelete,
  onToggleAdd,
  onToggleFilter,
  isAddOpen,
  isFilterOpen,
  isFilteredView,
  onClearFilter,
  interactionsDisabled,
}: ComponentsTableProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Components</h2>
        <div className="panel-actions">
          <button type="button" onClick={onToggleAdd} disabled={interactionsDisabled}>
            {isAddOpen ? 'Close Add' : '+ Add'}
          </button>
          <button type="button" onClick={onToggleFilter} disabled={interactionsDisabled}>
            {isFilterOpen ? 'Close Filter' : 'Filter'}
          </button>
          {isFilteredView && (
            <button
              type="button"
              className="button-muted"
              onClick={onClearFilter}
              disabled={interactionsDisabled}
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      <table className="component-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Category</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6}>{isFilteredView ? 'No matching components.' : 'No components yet.'}</td>
            </tr>
          )}
          {rows.map((component) => {
            const categoryName =
              categories.find((category) => category.id === component.category_id)?.name ??
              `Category ${component.category_id}`
            const details =
              categoryName === 'Resistors' && component.resistance_ohms !== null
                ? `${component.resistance_ohms} Ohms`
                : categoryName === 'Batteries' &&
                    component.voltage_volts !== null &&
                    component.capacity_mah !== null
                  ? `${component.voltage_volts} V / ${component.capacity_mah} mAh`
                  : categoryName === 'Capacitors' && component.capacitance_farads !== null
                    ? `${component.capacitance_farads} F`
                    : '-'

            return (
              <tr key={component.id}>
                <td>{component.name}</td>
                <td>{component.quantity}</td>
                <td>${component.price.toFixed(2)}</td>
                <td>{categoryName}</td>
                <td>{details}</td>
                <td className="row-actions">
                  <button type="button" onClick={() => onEdit(component)} disabled={interactionsDisabled}>
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button-danger"
                    onClick={() => onDelete(component.id)}
                    disabled={interactionsDisabled}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </section>
  )
}
