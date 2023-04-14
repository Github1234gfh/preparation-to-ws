import { Outlet } from 'react-router-dom'
import { Header } from './Header'

export const Layout = ({ token, setToken }) => {
    return (
        <div className='container py-3'>
            <header>
                <Header token={token} setToken={setToken} />
            </header>
            <main>
                <Outlet />
            </main>
            <footer className="pt-4 my-md-5 pt-md-5 border-top">
                <div className="row">
                    <div className="col-12 col-md">
                        <small className="d-block mb-3 text-muted">&copy; 2017–2021</small>
                    </div>
                </div>
            </footer>
        </div>
    )
}