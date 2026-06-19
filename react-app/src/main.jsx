import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { ModelManager, AuthoringUtils } from '@adobe/aem-spa-page-model-manager'
import App from './App'
import './App.css'
import './ComponentRegistry'

function render() {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <HashRouter>
        <App />
      </HashRouter>
    </StrictMode>
  )
}

if (AuthoringUtils.isInEditor()) {
  ModelManager.initializeAsync()
  ModelManager.initialize().then(() => render()).catch(() => render())
} else {
  render()
}
