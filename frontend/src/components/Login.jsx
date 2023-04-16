import { useEffect, useState } from "react"
import { Instance } from '../http/Instance'
import { Link, useNavigate } from "react-router-dom"

export const Login = ({ token, setToken, setTitle }) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const login = async () => {
        await Instance('login', 'POST', false, {
            email: email,
            password: password
        }).then(rez =>
            rez.ok ? rez.json().then(g => { setToken(g.body.user_token); localStorage.setItem('token', g.body.user_token); navigate('/') })
                : rez.json().then(g =>
                    setError(g.error.errors ? g.error.errors : g.error))
        )
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
        setTitle('Авторизация')
    }, [])

    const onsubmit = (e) => {
        e.preventDefault()
        login()
    }

    return (
        <>
            <div className="row render row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center">
                <div className="col">
                    <div className="row">
                        <form onSubmit={e => onsubmit(e)}>
                            {
                                error.message ? <span style={{ color: 'red' }}>{error.message}</span> : null
                            }
                            <div className="form-floating mb-3">
                                <input style={error.email || error.message ? { border: "1px solid red" } : null} value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label style={error.fio || error.message ? { color: "red" } : null} htmlFor="floatingInput">Email</label>
                            </div>
                            {
                                error.email ? <span style={{ color: 'red' }}>{error.email}</span> : null
                            }
                            <div className="form-floating mb-3">
                                <input style={error.password || error.message ? { border: "1px solid red" } : null} value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label style={error.fio || error.message ? { color: "red" } : null} htmlFor="floatingPassword">Password</label>
                            </div>
                            {
                                error.password ? <span style={{ color: 'red' }}>{error.password}</span> : null
                            }

                            <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">Войти</button>
                            <Link to={'/'} className="w-100 btn btn-lg btn-outline-info" type="submit">Назад</Link>
                        </form>
                    </div>

                </div>
            </div>
        </>
    )
}