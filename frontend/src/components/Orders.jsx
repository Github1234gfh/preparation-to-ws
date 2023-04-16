import { useEffect, useState } from "react"
import { Instance } from '../http/Instance'

import { Link, useNavigate } from "react-router-dom"

export const Orders = ({ token, setTitle }) => {

    const [items, setItems] = useState(false)

    const navigate = useNavigate()

    const get = async () => {
        await Instance('order', 'GET', token).then(rez => rez.json().then(g => setItems(g.body)))
    }

    useEffect(() => {
        if (!token) {
        navigate('/registration')
            
        }
        setTitle('Ваши заказы')
        get()
    }, [])


    return (
        <div className="render">
            {
                items && items.length > 0 ? items.map((item) => {
                    return (
                        <div key={item.id} className="row row-cols-1 row-cols-md-3 mb-3 text-center bg-light">

                            <h2 className="w-100">Заказ №P{item.id}</h2>

                            {
                                item.products.map(elem => {
                                    return (
                                        <div key={elem.id} className="col">
                                            <div className="card mb-4 rounded-3 shadow-sm">
                                                <div className="card-header py-3">
                                                    <h4 className="my-0 fw-normal">{elem.name}</h4>
                                                </div>
                                                <div className="card-body">
                                                    <h1 className="card-title pricing-card-title">{elem.price}р.<small className="text-muted fw-light"> &times; 1 шт.</small></h1>
                                                    <p>{elem.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            <h2 className="w-100">Итоговая стоимость: {item.order_price}р.</h2>
                        </div>

                    )
                })

                    : items && items.length === 0 ? <h1>Нет заказов</h1>
                        : <>Загрузка...</>
            }


            <div className="row justify-content-center gap-1">
                <Link to={'/'} className="col-6 btn btn-lg btn-outline-info mb-3" type="button">Назад</Link>
            </div>
        </div>
    )
}