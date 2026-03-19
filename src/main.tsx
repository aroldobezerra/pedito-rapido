import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // Assuming index.css exists, otherwise this will need to be adjusted

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
