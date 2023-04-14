import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Main = ({ token }) => {

    const [products, setProducts] = useState(false);

    const navigate = useNavigate()

    const options = (method, body = '') => {
        return {
            method: method,
            headers: {
                'Content-Type': 'aplication/json',
            },
        }
    }



    const addTocart = async (e) => {
        if (token) {
            await fetch(`http://localhost:8000/2/api-cart/cart/${e}`, {
                method: 'POST',
                headers: {
                    'Content-type': 'aplication/json',
                    'Authorization': `Bearer ${token}`
                }
            })
        }
        else {
            navigate('/registration')
        }
    }

    const Get = async () => {
        await fetch('http://localhost:8000/2/api-cart/products', options('GET'))
            .then(rez => rez.json())
            .then(rez => setProducts(rez.body))
    }

    useEffect(() => {
        Get()
    }, [])

    return (
        <>
            <div className="pricing-header p-3 pb-md-4 mx-auto text-center">
                <h1 className="display-4 fw-normal">Каталог товаров</h1>
            </div>
            <div className="row row-cols-1 row-cols-md-3 mb-3 text-center">

                {products ?
                    products.map(item => {
                        return (
                            <div className="col" key={item.id}>
                                <div className="card mb-4 rounded-3 shadow-sm">
                                    <div className="card-header py-3">
                                        <h4 className="my-0 fw-normal">{item.name}</h4>
                                    </div>
                                    <div className="card-body">
                                        <h1 className="card-title pricing-card-title">{item.price}р.</h1>
                                        <p>{item.description}</p>
                                        <button type="button" onClick={() => addTocart(item.id)} className="w-100 btn btn-lg btn-outline-primary">Добавить в корзину</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                    : <h1>Loading...</h1>
                }
            </div>
        </>
    )
}