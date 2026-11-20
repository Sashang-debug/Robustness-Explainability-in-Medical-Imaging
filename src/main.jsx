import React from 'react'
import ReactDOM from 'react-dom/client'
import '@astryxdesign/core/reset.css'
import '@astryxdesign/core/astryx.css'
import { Theme } from '@astryxdesign/core/theme'
import { themes, defaultThemeSlug } from './astryx-themes'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Theme theme={themes[defaultThemeSlug]}>
      <App />
    </Theme>
  </React.StrictMode>,
)
