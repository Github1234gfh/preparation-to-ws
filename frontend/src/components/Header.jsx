import { Link, useNavigate } from "react-router-dom"
export const Header = ({ token, setToken }) => {

    const navigate = useNavigate()

    const logout = () => {
        setToken(null)
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <>
            <div className="d-flex flex-column flex-md-row Linklign-items-center pb-3 mb-4 border-bottom">
                <Link to={'/'} className="d-flex align-items-center text-dark text-decoration-none">
                    <span className="fs-4">«Just buy»</span>
                </Link>

                <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    {
                        token ?
                            <>
                                <Link to={'/cart'} className="me-3 py-2 text-dark text-decoration-none" >Корзина</Link>
                                <Link to={'/orders'} className="me-3 py-2 text-dark text-decoration-none" >Мои заказы</Link>
                                <Link to={'/'} onClick={() => logout()} className="me-3 py-2 text-dark text-decoration-none" >Выйти</Link>
                            </>
                            : <>
                                <Link to={'/registration'} className="me-3 py-2 text-dark text-decoration-none" >Регистрация</Link>
                                <Link to={'/login'} className="me-3 py-2 text-dark text-decoration-none" >Авторизация</Link>
                            </>
                    }

                </nav>
            </div>
        </>
    )
}