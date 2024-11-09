import { createRoot } from 'react-dom/client'
import './assets/css/App.css'
import App from './App.jsx'

import { QueryClient,QueryClientProvider } from '@tanstack/react-query'

let queryClient = new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false
    }
  }
})
createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
