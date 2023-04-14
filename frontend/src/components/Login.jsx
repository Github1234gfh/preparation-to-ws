import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

export const Login = ({ token, setToken }) => {

    const navigate = useNavigate()

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState(false)

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
        }).then(rez =>
        (rez.ok ? rez.json().then(g => {
            setToken(g.body.user_token);
            localStorage.setItem('token', g.body.user_token);
            navigate('/')
        })
            : rez.json().then(rez => {
                try {
                    setErrors(rez.error.errors ? rez.error.errors : rez.error)
                    console.log(rez.error.message)
                }
                catch {
                    console.log(rez)
                    // setErrors(rez.error)
                }
            }
            )))
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
                            {
                                errors.message ? <span style={{ color: 'red' }}>{errors.message}</span>
                                    : null
                            }
                            <div className="form-floating mb-3">
                                <input style={errors.email || errors.message ? { border: '1px solid red' } : null} value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email</label>
                            </div>
                            {
                                errors.email ? <span style={{ color: 'red' }}>{errors.email}</span> : null
                            }
                            <div className="form-floating mb-3">
                                <input style={errors.password || errors.message ? { border: '1px solid red' } : null} value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>
                            {
                                errors.password ? <span style={{ color: 'red' }}>{errors.password}</span> : null
                            }
                            <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">Войти</button>
                            <NavLink to={'/'}><button className="w-100 btn btn-lg btn-outline-info" type="submit">Назад</button></NavLink>

                        </form>
                    </div>

                </div>
            </div>
        </>

    )
}