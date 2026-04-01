from flask import Flask, request, jsonify
# Import the 'db' instance and your classes from your model.py file
from models import db, Category, Component 

app = Flask(__name__)

# Configure your database connection (using SQLite here for easy local testing)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///makerspace.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Bind the database to this specific Flask app
db.init_app(app)

DEFAULT_CATEGORIES = [
    "Microcontrollers",
    "Motors",
    "Batteries",
    "Driver Boards",
    "Sensor Boards",
    "Communication Boards",
    "Power Management Boards",
    "Resistors",
    "Capacitors",
    "Inductors",
    "Transistors",
    "Diodes",
    "LEDs",
    "Optocouplers",
    "Relays",
    "Switches",
    "Other",
]


def seed_default_categories():
    existing_names = {category.name for category in Category.query.all()}
    missing_names = [name for name in DEFAULT_CATEGORIES if name not in existing_names]

    if not missing_names:
        return

    for name in missing_names:
        db.session.add(Category(name=name))
    db.session.commit()


def ensure_component_price_column():
    table_info = db.session.execute(db.text("PRAGMA table_info(components)")).mappings().all()
    column_names = {column["name"] for column in table_info}

    if "price" in column_names:
        return

    db.session.execute(db.text("ALTER TABLE components ADD COLUMN price FLOAT NOT NULL DEFAULT 0.0"))
    db.session.commit()


def ensure_component_spec_columns():
    table_info = db.session.execute(db.text("PRAGMA table_info(components)")).mappings().all()
    column_names = {column["name"] for column in table_info}

    if "resistance_ohms" not in column_names:
        db.session.execute(db.text("ALTER TABLE components ADD COLUMN resistance_ohms FLOAT"))
    if "voltage_volts" not in column_names:
        db.session.execute(db.text("ALTER TABLE components ADD COLUMN voltage_volts FLOAT"))
    if "capacity_mah" not in column_names:
        db.session.execute(db.text("ALTER TABLE components ADD COLUMN capacity_mah FLOAT"))
    if "capacitance_farads" not in column_names:
        db.session.execute(db.text("ALTER TABLE components ADD COLUMN capacitance_farads FLOAT"))
    db.session.commit()


def parse_optional_float(value):
    if value is None or value == "":
        return None
    try:
        parsed = float(value)
    except (TypeError, ValueError):
        return None
    return parsed if parsed >= 0 else None


def serialize_component(component):
    return {
        "id": component.component_id,
        "name": component.name,
        "quantity": component.quantity_in_stock,
        "price": component.price,
        "category_id": component.category_id,
        "resistance_ohms": component.resistance_ohms,
        "voltage_volts": component.voltage_volts,
        "capacity_mah": component.capacity_mah,
        "capacitance_farads": component.capacitance_farads,
    }


def apply_category_specific_fields(component, category_name, data):
    resistance_ohms = parse_optional_float(data.get("resistance_ohms"))
    voltage_volts = parse_optional_float(data.get("voltage_volts"))
    capacity_mah = parse_optional_float(data.get("capacity_mah"))
    capacitance_farads = parse_optional_float(data.get("capacitance_farads"))

    normalized_category = category_name.lower()
    if normalized_category == "resistors":
        if resistance_ohms is None:
            return "Resistors require a resistance value."
        component.resistance_ohms = resistance_ohms
        component.capacitance_farads = None
        component.voltage_volts = None
        component.capacity_mah = None
    elif normalized_category == "batteries":
        if voltage_volts is None or capacity_mah is None:
            return "Batteries require both voltage and capacity."
        component.resistance_ohms = None
        component.capacitance_farads = None
        component.voltage_volts = voltage_volts
        component.capacity_mah = capacity_mah
    elif normalized_category == "capacitors":
        if capacitance_farads is None:
            return "Capacitors require a capacitance value."
        component.resistance_ohms = None
        component.voltage_volts = None
        component.capacity_mah = None
        component.capacitance_farads = capacitance_farads
    else:
        component.resistance_ohms = None
        component.voltage_volts = None
        component.capacity_mah = None
        component.capacitance_farads = None 

    return None

# Create the database tables based on model.py (runs when the app starts)
with app.app_context():
    db.create_all()
    ensure_component_price_column()
    ensure_component_spec_columns()
    seed_default_categories()

# ==========================================
# API ENDPOINTS (The Bridge to React)
# ==========================================

@app.route('/api/categories', methods=['GET'])
def get_categories():
    categories = Category.query.all()
    # This JSON is what React will use to dynamically build the dropdown [cite: 68-71]
    return jsonify({"categories": [{"id": c.category_id, "name": c.name} for c in categories]})

@app.route('/api/components', methods=['POST'])
def add_component():
    data = request.json
    category = Category.query.get(data['category_id'])
    if not category:
        return jsonify({"error": "Category not found"}), 404

    new_component = Component(
        name=data['name'],
        quantity_in_stock=data['quantity'],
        price=data['price'],
        category_id=data['category_id']
    )
    validation_error = apply_category_specific_fields(new_component, category.name, data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    db.session.add(new_component)
    db.session.commit()
    return jsonify({"message": "Component added successfully"}), 201

# Add your GET, PUT, and DELETE routes for components below...

@app.route('/api/components', methods=['GET'])
def get_components():
    components = Component.query.all()
    return jsonify({"components": [serialize_component(c) for c in components]})


@app.route('/api/components/report', methods=['GET'])
def get_components_report():
    min_qty = request.args.get('min_qty', type=int)
    max_qty = request.args.get('max_qty', type=int)
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    category_id = request.args.get('category_id', type=int)

    query = Component.query

    if min_qty is not None:
        query = query.filter(Component.quantity_in_stock >= min_qty)
    if max_qty is not None:
        query = query.filter(Component.quantity_in_stock <= max_qty)
    if min_price is not None:
        query = query.filter(Component.price >= min_price)
    if max_price is not None:
        query = query.filter(Component.price <= max_price)
    if category_id is not None:
        query = query.filter(Component.category_id == category_id)

    components = query.all()
    return jsonify({
        "filters": {
            "min_qty": min_qty,
            "max_qty": max_qty,
            "min_price": min_price,
            "max_price": max_price,
            "category_id": category_id,
        },
        "report": [
            serialize_component(c)
            for c in components
        ],
    })


@app.route('/api/components', methods=['PUT'])
def update_component():
    data = request.json
    component = Component.query.get(data['id'])
    if not component:
        return jsonify({"error": "Component not found"}), 404
    if 'name' in data:
        component.name = data['name']
    if 'quantity' in data:
        component.quantity_in_stock = data['quantity']
    if 'price' in data:
        component.price = data['price']
    if 'category_id' in data:
      component.category_id = data['category_id']

    category = Category.query.get(component.category_id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    validation_error = apply_category_specific_fields(component, category.name, data)
    if validation_error:
        return jsonify({"error": validation_error}), 400

    db.session.commit()
    return jsonify({"message": "Component updated successfully"}), 200
@app.route('/api/components', methods=['DELETE'])
def delete_component():
    data = request.json
    component = Component.query.get(data['id'])
    if not component:
        return jsonify({"error": "Component not found"}), 404
    db.session.delete(component)
    db.session.commit()
    return jsonify({"message": "Component deleted successfully"}), 200

if __name__ == '__main__':
    # Runs the backend server on port 5000
    app.run(debug=True, port=5000)