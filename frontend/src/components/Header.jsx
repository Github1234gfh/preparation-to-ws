import { NavLink, useNavigate } from "react-router-dom"

export const Header = ({ token, setToken }) => {

    const navigate = useNavigate()

    const logout = () => {
        localStorage.removeItem('token')
        setToken(null)
        navigate('/')
    }

    return (
        <>
            <div className="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
                <NavLink to={'/'} className="d-flex align-items-center text-dark text-decoration-none">
                    <span className="fs-4">«Just buy»</span>
                </NavLink>

                <nav className="d-inline-flex mt-2 mt-md-0 ms-md-auto">
                    {
                        token ?
                            <>
                                <NavLink to={'/orders'} style={(is) => ({ color: is.isActive ? 'red' : 'gray' })} className="me-3 py-2 text-dark text-decoration-none" href="#">Мои заказы</NavLink>
                                <NavLink to={'/cart'} style={(is) => ({ color: is.isActive ? 'red' : 'gray' })} className="me-3 py-2 text-dark text-decoration-none" href="#">Корзина</NavLink>
                                <a onClick={() => logout()} className="me-3 py-2 text-dark text-decoration-none" href="#">Выйти</a>
                            </>

                            :
                            <>
                                <NavLink to={'/registration'} style={(is) => ({ color: is.isActive ? 'red' : 'gray' })} className="me-3 py-2 text-dark text-decoration-none" >Регистрация</NavLink>
                                <NavLink to={'/login'} style={(is) => ({ color: is.isActive ? 'red' : 'gray' })} className="me-3 py-2 text-dark text-decoration-none" href="#">Авторизация</NavLink>
                            </>

                    }
                </nav>
            </div>
        </>
    )
}