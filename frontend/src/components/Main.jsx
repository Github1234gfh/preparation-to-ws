import { useEffect, useState } from "react"
import { Instance } from "../http/Instance"

export const Main = ({ token, setTitle }) => {

    const [items, setItems] = useState(false);

    const get = async () => {
        await Instance('products', 'GET').then(rez => rez.json()).then(rez => setItems(rez.body))
    }

    const addToCart = async (e) => {
        await Instance(`cart/${e}`, "POST", token)
    }

    useEffect(() => {
        setTitle('Каталог товаров')
        get()

    }, [])

    return (
        <div className="render">
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">
                {
                    items ? items.map((item) => {
                        return (
                            <div className="col" key={item.id}>
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3">
                                        <h4 className="my-0 fw-normal">{item.name}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title">{item.price}p.</h1>
                                        <p>{item.description}</p>
                                        {
                                            token ?
                                                <button onClick={() => addToCart(item.id)} type="button" className="w-100 addToCart btn btn-lg btn-outline-primary">Добавить в корзину</button>
                                                : null
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })
                        : <h1>Загрузка...</h1>
                }

            </div>
        </div>
    )
}