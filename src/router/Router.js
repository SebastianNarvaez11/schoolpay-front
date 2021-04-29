import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { getToken } from '../helpers/helper'
import { getCurrentUser } from '../redux/actions/authActions'
import RouterAdmin from './RouterAdmin'
import RouterStudent from './RouterStudent'
import HomePage from '../views/public/HomePage'
import Login from '../views/public/Login'
import Admin from "../views/admin" //Busca el index.js de esta carpeta para enlazar el restos de rutas
import Student from '../views/student' //Busca el index.js de esta carpeta para enlazar el restos de rutas
import Assistant from '../views/assistant' //Busca el index.js de esta carpeta para enlazar el restos de rutas
import RouterAssistant from './RouterAssistant'
import Error_403 from '../views/errors/Error_403'
import Error_404 from '../views/errors/Error_404'

//---Roles---
//1-Admin 
//2-Assistant
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
                <RouterAdmin path='/admin' roles={'1'} component={Admin} />
                <RouterAssistant path='/assistant' roles={'2'} component={Assistant} />
                <RouterStudent path='/student' roles={'3'} component={Student} />
                <Route exact path='/' component={HomePage} />
                <Route exact path='/login' component={Login} />
                <Route exact path='/403' component={Error_403} />
                <Route path='*' component={Error_404} />
            </Switch>
        </BrowserRouter>
    )
}

export default Router
