import InventoryManager from './components/InventoryManager'
import { ThemeProvider } from './context/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <InventoryManager />
    </ThemeProvider>
  )
}

export default App
