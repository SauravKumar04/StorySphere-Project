import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import AppRouter from './routes/AppRouter'
import { useTheme } from './context/ThemeContext'

function App() {
  const { theme } = useTheme()

  return (
    <Router>
      <div className="App" style={{ 
        backgroundColor: theme.palette.background.default,
        minHeight: '100vh'
      }}>
        <AppRouter />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            backgroundColor: theme.palette.primary.main,
            color: 'white'
          }}
        />
      </div>
    </Router>
  )
}

export default App