import type { ComponentFormState, Category } from '../types/inventory'

interface ComponentEditorProps {
  form: ComponentFormState
  categories: Category[]
  isEditing: boolean
  onChange: (next: ComponentFormState) => void
  onSubmit: () => void
  onClose: () => void
}

export default function ComponentEditor({
  form,
  categories,
  isEditing,
  onChange,
  onSubmit,
  onClose,
}: ComponentEditorProps) {
  const selectedCategory = categories.find((category) => String(category.id) === form.categoryId)
  const selectedCategoryName = selectedCategory?.name.toLowerCase() ?? ''

  return (
    <section className="panel">
      <h2>{isEditing ? 'Edit Component' : 'Add Component'}</h2>
      <div className="form-grid">
        <label htmlFor="component-name">Name</label>
        <input
          id="component-name"
          name="name"
          value={form.name}
          onChange={(event) => onChange({ ...form, name: event.target.value })}
          required
        />

        <label htmlFor="component-quantity">Quantity</label>
        <input
          id="component-quantity"
          name="quantity"
          type="number"
          min={0}
          value={form.quantity}
          onChange={(event) =>
            onChange({ ...form, quantity: Number.parseInt(event.target.value || '0', 10) })
          }
          required
        />

        <label htmlFor="component-price">Price</label>
        <input
          id="component-price"
          name="price"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(event) => onChange({ ...form, price: Number.parseFloat(event.target.value || '0') })}
          required
        />

        <label htmlFor="category-select">Category</label>
        <select
          id="category-select"
          name="categoryId"
          value={form.categoryId}
          onChange={(event) => onChange({ ...form, categoryId: event.target.value })}
          required
        >
          <option value="">-- Select a Category --</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {selectedCategoryName === 'resistors' && (
          <>
            <label htmlFor="resistance-ohms">Resistance (Ohms)</label>
            <input
              id="resistance-ohms"
              name="resistanceOhms"
              type="number"
              min={0}
              step="0.01"
              value={form.resistanceOhms}
              onChange={(event) => onChange({ ...form, resistanceOhms: event.target.value })}
              required
            />
          </>
        )}

        {selectedCategoryName === 'batteries' && (
          <>
            <label htmlFor="voltage-volts">Voltage (V)</label>
            <input
              id="voltage-volts"
              name="voltageVolts"
              type="number"
              min={0}
              step="0.01"
              value={form.voltageVolts}
              onChange={(event) => onChange({ ...form, voltageVolts: event.target.value })}
              required
            />

            <label htmlFor="capacity-mah">Capacity (mAh)</label>
            <input
              id="capacity-mah"
              name="capacityMah"
              type="number"
              min={0}
              step="0.01"
              value={form.capacityMah}
              onChange={(event) => onChange({ ...form, capacityMah: event.target.value })}
              required
            />
          </>
        )}
        {selectedCategoryName === 'capacitors' && (
          <>
            <label htmlFor="capacitance-farads">Capacitance (F)</label>
            <input
              id="capacitance-farads"
              name="capacitanceFarads"
              type="number"
              min={0}
              step="0.01"
              value={form.capacitanceFarads}
              onChange={(event) => onChange({ ...form, capacitanceFarads: event.target.value })}
              required
            />
          </>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onSubmit}>
          {isEditing ? 'Update Component' : 'Add Component'}
        </button>
        <button type="button" className="button-muted" onClick={onClose}>
          Cancel
        </button>
      </div>
    </section>
  )
}
