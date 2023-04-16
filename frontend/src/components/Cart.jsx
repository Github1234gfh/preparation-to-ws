import { useEffect, useState } from 'react'
import { Instance } from '../http/Instance'
import { Link, useNavigate } from 'react-router-dom';

export const Cart = ({ token, setTitle }) => {

    const [items, setItems] = useState(false);

    const get = async () => {
        await Instance('cart', 'GET', token).then(rez =>
            rez.json().then(g => {
                if (g.body.length === 0) {
                    setItems([])
                    return
                }
                setItems(
                    g.body[0].products.map(elem => {
                        elem['count'] = 1
                        return elem
                    })
                )
            }))
    }

    const navigate = useNavigate()

    const all_cost = () => {
        let all_price = 0
        if (items && items.length > 0) {
            items.map((item) => {
                all_price += item.price * item.count
            })
            return all_price
        }
    }

    const incriment = (index) => {
        const copy = Object.assign([], items)
        copy[index].count += 1
        setItems(copy)
    }

    const dicrement = (index) => {
        const copy = Object.assign([], items)
        if (copy[index].count > 1) {
            copy[index].count -= 1
        }
        setItems(copy)
    }

    const Delete = async (e) => {
        setItems(items.filter((item) => (item.id === e ? false : true)))
        await Instance(`cart/${e}`, 'DELETE', token)
    }

    useEffect(() => {
        if (!token) {
            navigate('/registration')
        }
        setTitle('Корзина')
        get()

    }, [])

    const makeorder = async () => {
        await Instance('order', 'POST', token, {
            order_price: all_cost()
        })
        navigate('/orders')
    }

    return (
        <div className='render'>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">

                {
                    items && items.length > 0 ? items.map((item, index) => {

                        return (
                            <div className="col" key={item.id}>
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3">
                                        <h4 className="my-0 fw-normal">{item.name}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title">{item.price}р.<small className="text-muted fw-light"> &times; {item.count}
                                            шт.</small></h1>
                                        <p>{item.description}</p>

                                        <button onClick={() => incriment(index)} type="button" className="btn btn-lg btn-info mb-3">+</button>
                                        <button onClick={() => dicrement(index)} type="button" className="btn btn-lg btn-warning mb-3">&minus;</button>
                                        <button onClick={() => Delete(item.id)} type="button" className="btn btn-lg btn-outline-danger mb-3">Удалить из корзины</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                        : items && items.length === 0 ? <h1>Корзина пуста</h1>
                            : <h1>Загрузка...</h1>
                }
            </div>
            <div className="row justify-content-center gap-1">
                {
                    items && items.length > 0 ?
                        <h2 className="mb-5">Итоговая стоимость: {all_cost()}р.</h2>
                        : null
                }
                <Link to={'/'} className="col-6 btn btn-lg btn-outline-info mb-3" type="button">Назад</Link>
                {
                    items && items.length > 0 ?
                        <button onClick={() => makeorder()} type="button" className="col-6 btn btn-lg btn-primary mb-3">Оформить заказ</button>

                        : null

                }
            </div>
        </div>
    )
}