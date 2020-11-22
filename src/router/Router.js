import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getToken } from '../helpers/helper'
import { getCurrentUser } from '../redux/actions/authActions'
import RouterAdmin from './RouterAdmin'
import RouterStudent from './RouterStudent'
import Error from '../views/public/Error'
import HomePage from '../views/public/HomePage'
import Login from '../views/public/Login'
import Admin from "../views/admin" //Busca el index.js de esta carpeta para enlazar el restos de rutas
import Student from '../views/student' //Busca el index.js de esta carpeta para enlazar el restos de rutas

//---Roles---
//1-Admin 
//2-Asistent
//3-Student

const Router = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        function chargeUser() {
            if (!getToken()) {
                return 
            }
            try {
               dispatch(getCurrentUser())
            } catch (e) {
                console.log(e)
            }
        }
        chargeUser()
        // eslint-disable-next-line
    }, [])

    return (
        <BrowserRouter>
            <Switch>
                <RouterAdmin path='/admin' roles={['1', '2']} component={Admin} />
                <RouterStudent path='/student' roles={'3'} component={Student} />
                <Route exact path='/' component={HomePage} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/error' component={Error} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router
