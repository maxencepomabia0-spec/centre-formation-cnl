import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import './index.css'
import './styles/navbar.css'
import App from './App.jsx'
import './styles/Hero.css'
import './styles/Leadership.css'
import './styles/formations.css'
import './pages/FormationDetails/FormationDetails.css'
import './styles/site-lower.css'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)