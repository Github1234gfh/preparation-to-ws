import { Route, Routes } from "react-router-dom"
import { Layout } from "./layout"
import { Main } from "./Main"
import { useState } from "react"
import { Register } from "./Registration"
import { Login } from './Login'
import { Orders } from './Orders'
import { Cart } from './Cart'

export const Index = () => {

    const [token, setToken] = useState(localStorage.getItem('token'))
    const [title, setTitle] = useState('')

    return (
        <>
            <Routes>
                <Route path="/" element={<Layout token={token} setToken={setToken} title={title} />}>
                    <Route index element={<Main token={token} setTitle={setTitle} />} />
                    <Route path="*" element={<Main token={token} setTitle={setTitle} />} />
                    <Route path="registration" element={<Register token={token} setTitle={setTitle} />} />
                    <Route path="login" element={<Login token={token} setToken={setToken} setTitle={setTitle} />} />
                    <Route path="orders" element={<Orders token={token} setTitle={setTitle} />} />
                    <Route path="cart" element={<Cart token={token} setTitle={setTitle} />} />
                </Route>
            </Routes>
        </>
    )
}