import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { parsedEnv } from '@/env'
import { store } from '@/store'
import getRouter from '@/routes'
import './index.css'

const persistor = persistStore(store)
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
                <RouterProvider router={getRouter(parsedEnv.VITE_NODE_ENV)} />
            </QueryClientProvider>
        </PersistGate>
        <ToastContainer />
    </ReduxProvider>
)
