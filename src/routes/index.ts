import { createBrowserRouter } from 'react-router-dom'
import MainRoutes from '@/routes/MainRoutes'
import AuthRoutes from '@/routes/AuthRoutes'

const developmentRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes])
const testingRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes])
const productionRoutes = createBrowserRouter([...MainRoutes, ...AuthRoutes])

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
