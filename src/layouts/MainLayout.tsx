import { Outlet } from 'react-router-dom'
// import Appbar from '@/components/layout/Appbar'
// import Footer from '@/components/layout/Footer'

const MainLayout = () => {
    return (
        <div className="flex min-h-screen flex-col">
            {/* <Appbar /> */}
            <main>
                <Outlet />
            </main>
            {/* <Footer /> */}
        </div>
    )
}

export default MainLayout
