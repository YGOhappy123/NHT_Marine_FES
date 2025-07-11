import { createBrowserRouter } from 'react-router-dom'
import MainRoutes from '@/routes/MainRoutes'

const developmentRoutes = createBrowserRouter([...MainRoutes])
const testingRoutes = createBrowserRouter([...MainRoutes])
const productionRoutes = createBrowserRouter([...MainRoutes])

const getRouter = (environment: 'development' | 'testing' | 'production') => {
    switch (environment) {
        case 'development':
            return developmentRoutes
        case 'testing':
            return testingRoutes
        case 'production':
            return productionRoutes
    }
}

export default getRouter
