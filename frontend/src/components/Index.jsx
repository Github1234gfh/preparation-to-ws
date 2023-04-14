
import { Route, Routes } from "react-router-dom"
import { Layout } from "./layout"
import { Main } from "./Main"
import { Login } from './Login'
import { Registration } from "./Registration"
import { Cart } from './Cart'
import { Orders } from './Orders'
import { useState } from "react"

export const Index = () => {

    const checkToken = () => {
        return (localStorage.getItem('token'))
    }

    const [token, setToken] = useState(checkToken);


    return (
        <>
            <Routes>
                <Route path="/" element={<Layout token={token} setToken={setToken}/>}>
                    <Route path="*" element={<Main token={token} />} />
                    <Route index element={<Main token={token} />} />
                    <Route path="login" element={<Login token={token} setToken={setToken} />} />
                    <Route path="registration" element={<Registration token={token} />} />
                    <Route path="cart" element={<Cart token={token} />} />
                    <Route path="orders" element={<Orders token={token} />} />
                </Route>
            </Routes>
        </>
    )
}