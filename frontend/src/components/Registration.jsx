import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"

export const Registration = ({ token }) => {

    const navigate = useNavigate()

    const [fio, setFio] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    useEffect(() => {
        if (token) {
            navigate('/')
        }
    })

    const register = async () => {
        await fetch('http://localhost:8000/2/api-cart/signup', {

            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fio: fio,
                email: email,
                password: password
            }),


        })
        navigate('/login')
    }


    const onsubmit = (e) => {
        e.preventDefault()
        register()
        // navigate('/login')
    }

    return (
        <>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="display-4 fw-normal">Регистрация</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center justify-content-center">
                <div className="col">
                    <div className="row">
                        <form onSubmit={e => onsubmit(e)}>
                            <h1 className="h3 mb-3 fw-normal">Пожалуйста заполните все поля</h1>
                            <div className="form-floating mb-3">
                                <input value={fio} onChange={e => setFio(e.target.value)} type="text" className="form-control" id="floatingFio" placeholder="ФИО" />
                                <label htmlFor="floatingFio">ФИО</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="form-control" id="floatingInput" placeholder="name@example.com" />
                                <label htmlFor="floatingInput">Email</label>
                            </div>
                            <div className="form-floating mb-3">
                                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="form-control" id="floatingPassword" placeholder="Password" />
                                <label htmlFor="floatingPassword">Password</label>
                            </div>

                            <button className="w-100 btn btn-lg btn-primary mb-3" type="submit">Зарегистрироваться</button>
                            <NavLink to={'/'}><button className="w-100 btn btn-lg btn-outline-info" type="submit">Назад</button></NavLink>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}