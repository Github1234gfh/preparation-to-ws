import { Outlet } from "react-router-dom"
import { Header } from './Header'

export const Layout = ({ token, setToken, title }) => {
    return (
        <div className="container py-3">
            <header>
                <Header token={token} setToken={setToken} />
                <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                    <h1 className="display-4 fw-normal">{title}</h1>
                </div>
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