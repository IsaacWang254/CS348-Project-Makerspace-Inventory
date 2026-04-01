import './App.css'
import ComponentForm from './components/componentForm'

function App() {
  return (
    <>
      <h1>My Electronics Makerspace Inventory</h1>
      <div className="app-container">
        <p className="app-subtitle">Manage your Electronics Makerspace components, run filtered reports, and update stock in one place.</p>
        <ComponentForm />
      </div>
    </>
  )
}

export default App
