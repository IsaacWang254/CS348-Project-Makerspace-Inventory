# CS 348 Project

## How to Run

### Backend (Flask + SQLAlchemy)

```bash
cd project1/backend/app
../venv/bin/python app.py
```

Backend runs at: `http://127.0.0.1:5000`

### Frontend (React + Vite)

```bash
cd project1/frontend/project1
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
