import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Orders = ({ token }) => {

    const navigate = useNavigate()
    const [orders, setOrders] = useState(false);

    const getOrder = async () => {
        await fetch('http://localhost:8000/2/api-cart/order', {
            method: 'GET',
            headers: {
                'Content-type': 'aplication/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(rez => rez.json()).then(rez => setOrders(rez.body))
    }

    useEffect(() => {
        if (!token) {
            navigate('/registration')
        }
        getOrder()
    }, [])

    
    return (
        <>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="display-4 fw-normal">Ваши заказы</h1>
            </div>
            {
                orders && orders.length > 0? orders.map((item, index )=> {
                    return (
                        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center bg-light" key={item.id}>

                            <h2 className="w-100">Заказ #{index+1}</h2>
                            {
                                item.products.map((elem) => {
                                    return (

                                        <div className="col" key={elem.id}>
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
                                <h2 className="w-100">Итоговая стоимость: {item.order_price}</h2>
                        </div>
                    )
                })
                    : orders && orders.length === 0? <h1>Нет заказов</h1>
                    : <h1>Loading...</h1>

            }

            <div className="row justify-content-center gap-1">
                <Link to={'/'} className="col-6 btn btn-lg btn-outline-info mb-3" type="button">Назад</Link>
            </div>
        </>
    )
}