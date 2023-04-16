import { useEffect, useState } from "react"
import { Instance } from '../http/Instance'

import { Link, useNavigate } from "react-router-dom"

export const Register = ({ token, setTitle }) => {

    const [fio, setFio] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const navigate = useNavigate()

    const reg = async () => {
        await Instance('signup', 'POST', false, {
            fio: fio,
            email: email,
            password: password
        }).then(rez =>
            rez.ok ? navigate('/login')
                : rez.json().then(rez => setError(rez.error.errors))
        )
    }

    useEffect(() => {
        if (token) {
            navigate('/')
        }
        setTitle('Регистрация')

    }, [])

    const onsubmit = (e) => {
        e.preventDefault()
        reg()
    }

    return (
        <>
            <div className="row render row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center">


                <div className="col">
                    <div className="row">
                        <form onSubmit={e => onsubmit(e)}>
                            <h1 className="h3 mb-3 fw-normal">Пожалуйста заполните все поля</h1>
                            <div className="form-floating mb-3">
                                <input style={error.fio ? { border: "1px solid red" } : null} value={fio} onChange={e => setFio(e.target.value)} type="text" className="form-control" id="floatingFio" placeholder="ФИО" />
                                <label style={error.fio ? { color: "red" } : null} htmlFor="floatingFio">ФИО</label>
                            </div>
                            {
                                error.fio ? <span style={{ color: 'red' }}>{error.fio}</span> : null
                            }
                            <div className="form-floating mb-3">
                                <input style={error.email ? { border: "1px solid red" } : null} value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label style={error.fio ? { color: "red" } : null} htmlFor="floatingInput">Email</label>
                            </div>
                            {
                                error.email ? <span style={{ color: 'red' }}>{error.email}</span> : null
                            }
                            <div className="form-floating mb-3">
                                <input style={error.password ? { border: "1px solid red" } : null} value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label style={error.fio ? { color: "red" } : null} htmlFor="floatingPassword">Password</label>
                            </div>
                            {
                                error.password ? <span style={{ color: 'red' }}>{error.password}</span> : null
                            }

                            <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">Зарегистрироваться</button>
                            <Link to={'/'} className="w-100 btn btn-lg btn-outline-info" type="submit">Назад</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}