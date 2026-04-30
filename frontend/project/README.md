# CS 348 Project

## How to Run

### Backend (Flask + SQLAlchemy)

```bash
cd project/backend/app
../venv/bin/python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### Frontend (React + Vite)

```bash
cd project/frontend/project
npm install
npm run dev
```

Frontend runs at: `http://127.0.0.1:5173`

The frontend proxies `/api/*` requests to the Flask backend through `vite.config.ts`.

## Database Schema (Stage 2)

### SQL Tables

```sql
CREATE TABLE categories (
  category_id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL
);

CREATE TABLE components (
  component_id INTEGER PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  quantity_in_stock INTEGER NOT NULL,
  price FLOAT NOT NULL,
  resistance_ohms FLOAT NULL,
  voltage_volts FLOAT NULL,
  capacity_mah FLOAT NULL,
  capacitance_farads FLOAT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
```

## Stage 3 Database Concepts

### SQL injection protection
- The Flask API uses SQLAlchemy ORM queries instead of building SQL strings from user input.
- Report filter values are parsed with typed request arguments in `get_components_report`, then applied in `build_components_report_query` with SQLAlchemy filter expressions.
- The only raw SQL statements are fixed startup schema-maintenance statements; no request data is interpolated into `db.text()`.

### Indexes
- `ix_categories_name` supports loading and displaying category choices from the database.
- `ix_components_category_id` supports category filtering in the component report.
- `ix_components_quantity_in_stock` supports quantity range filters in the component report.
- `ix_components_price` supports price range filters in the component report.
- `ix_components_report_filters` supports combined report filters on category, quantity, and price.

### Transactions and isolation
- Each create, update, and delete request is treated as one logical transaction and calls `commit_or_rollback`.
- If a database commit fails, the session is rolled back so partial changes are not kept in the current transaction.
- The local development database is SQLite, which serializes writes and provides transaction isolation suitable for this single-user demo. In a multi-user deployment, the same SQLAlchemy transaction boundaries would be used with the database provider's default isolation level unless a stricter level is required.

## AI Usage

### AI tools used
- Cursor AI assistant for code generation, refactoring help, and debugging support.

### Tasks AI assisted with
- TypeScript migration and frontend component refactors.
- Flask + SQLAlchemy CRUD/report endpoint scaffolding and updates.
- UI behavior improvements (modal workflows, table-first interactions, styling cleanup).
- Adding category-specific component attributes (resistance, voltage/capacity, capacitance).

### How output was verified and modified
- Reviewed and edited AI-generated code before keeping it.
- Ran frontend checks: `npm run typecheck`, `npm run lint`, and `npm run build`.
- Ran backend syntax checks and manually tested API/UI flows (insert, update, delete, filter/report).
- Adjusted generated code to match project rubric requirements and expected behavior.

I understand and can explain all submitted code, schema decisions, and API/UI behavior used in this project.
