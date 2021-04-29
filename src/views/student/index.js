import React from 'react'
import { Switch, Route } from "react-router-dom";
import { useSelector } from 'react-redux'
import NavbarAdmin from '../../components/Navbars/NavbarAdmin'
import StudentSidebar from '../../components/Sidebars/StudentSidebar'
import ListPayments from './ListPayments'
import Error_404 from '../errors/Error_404'


const RouterIndex = ({ match }) => {
    const stateSidebar = useSelector(state => state.uiReducer.sidebar)
    return (
        <div>
            <div className={stateSidebar ? 'd-flex' : 'd-flex toggled'} id="wrapper">
                <StudentSidebar />
                <div id="page-content-wrapper">
                    <NavbarAdmin />
                    <Switch>
                        <Route exact path={match.path} component={ListPayments} />
                        <Route path='*' component={Error_404} />
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default RouterIndex