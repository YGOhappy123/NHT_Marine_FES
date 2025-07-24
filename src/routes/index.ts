import { createBrowserRouter } from 'react-router-dom'
import MainRoutes from '@/routes/MainRoutes'
import PersonnelRoutes from '@/routes/PersonnelRoutes'
import OrderRoutes from '@/routes/OrderRoutes'
import ProductRoutes from '@/routes/ProductRoutes'
import AuthRoutes from '@/routes/AuthRoutes'

const developmentRoutes = createBrowserRouter([
    ...MainRoutes,
    ...PersonnelRoutes,
    ...OrderRoutes,
    ...ProductRoutes,
    ...AuthRoutes
])

const productionRoutes = createBrowserRouter([
    ...MainRoutes,
    ...PersonnelRoutes,
    ...OrderRoutes,
    ...ProductRoutes,
    ...AuthRoutes
])

const getRouter = (environment: 'development' | 'production') => {
    switch (environment) {
        case 'development':
            return developmentRoutes
        case 'production':
            return productionRoutes
        default:
            throw new Error('Invalid environment.')
    }
}

export default getRouter
