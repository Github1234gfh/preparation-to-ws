import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

export const Login = ({ token, setToken }) => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const login = async () => {
        await fetch('http://localhost:8000/2/api-cart/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },


            body: JSON.stringify({
                email: email,
                password: password,
            })
        }).then(rez => rez.json()).then(rez => { setToken(rez.body.user_token); localStorage.setItem('token', rez.body.user_token) })
    }

    const onssubmit = (e) => {
        e.preventDefault()
        login()
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    })

    return (
        <>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="display-4 fw-normal">Авторизация</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center">
                <div className="col">
                    <div className="row">
                        <form onSubmit={e => onssubmit(e)}>
                            <div className="form-floating mb-3">
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>

                            <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">Войти</button>
                            <NavLink to={'/'}><button className="w-100 btn btn-lg btn-outline-info" type="submit">Назад</button></NavLink>

                        </form>
                    </div>

                </div>
            </div>
        </>

    )
}