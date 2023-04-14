import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

export const Cart = ({ token }) => {
    const navigate = useNavigate()

    const [items, setItems] = useState(false);

    const getCart = async () => {
        await fetch('http://localhost:8000/2/api-cart/cart', {
            method: 'GET',
            headers: {
                'Content-type': 'aplication/json',
                'Authorization': `Bearer ${token}`
            }
        }).then(rez => rez.json()).then(rez => {

            if (rez.body.length !== 0) {
                const products = [rez.body[0].products.map(item => {
                    item['count'] = 1
                    return item
                })]
                setItems(products[0])
            }
            else {setItems(rez.body)}

        })
    }

    const deleteItem = async (e) => {
        setItems(items.filter(item => (item.id === e ? false : true)))
        await fetch(`http://localhost:8000/2/api-cart/cart/${e}`, {
            method: 'DELETE',
            headers: {
                'Content-type': 'aplication/json',
                'Authorization': `Bearer ${token}`
            }
        })
    }

    const all_price = () => {
        let all_cost = 0
        if (items) {
            items.map(item => all_cost += item.price * item.count)
        }
        return all_cost
    }

    const addCount = (index) => {
        const copy = Object.assign([], items)
        copy[index].count += 1

        setItems(copy)
    }

    const removeCount = (index) => {
        const copy = Object.assign([], items)

        if (copy[index].count > 1) {
            copy[index].count -= 1
        }

        setItems(copy)
    }

    const makeOrder = async () => {
        await fetch('http://localhost:8000/2/api-cart/order', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                'order_price': all_price()
            })
        })
        navigate('/orders')
    }


    useEffect(() => {
        if (!token) {
            navigate('/registration')
        }
        getCart()
    }, [])

    return (
        <>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="display-4 fw-normal">Корзина</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {
                    items && items.length > 0 ?
                        items.map((item, index) => {

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

                                            <button type="button" onClick={() => addCount(index)} className="btn btn-lg btn-info mb-3">+</button>
                                            <button type="button" onClick={() => removeCount(index)} className="btn btn-lg btn-warning mb-3">&minus;</button>
                                            <button onClick={() => deleteItem(item.id)} type="button" className="btn btn-lg btn-outline-danger mb-3">Удалить из корзины</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })

                        : items && items.length === 0 ? <h1>Корзина пуста</h1>
                            : <h1>Loading...</h1>

                }

            </div>
            <div className="row justify-content-center gap-1">
                {
                    items && items.length > 0 ?
                        <h2 className="mb-5">Итоговая стоимость: {all_price()}</h2>
                        : null
                }

                <Link to={'/'} className="col-6 btn btn-lg btn-outline-info mb-3" type="button">Назад</Link>

                {
                    items && items.length > 0 ?
                        <button type="button" onClick={() => makeOrder()} className="col-6 btn btn-lg btn-primary mb-3">Оформить заказ</button>
                        : null
                }

            </div>
        </>
    )
}