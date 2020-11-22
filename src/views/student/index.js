import React from 'react'
import { Switch, Route } from "react-router-dom";
import HeaderStudent from '../../components/Headers/students/HeaderStudent'
import { useSelector } from 'react-redux'
import NavbarAdmin from '../../components/Navbars/NavbarAdmin'
import StudentSidebar from '../../components/Sidebars/StudentSidebar'
import ListPayments from './ListPayments'


const RouterIndex = ({ match }) => {
    const stateSidebar = useSelector(state => state.uiReducer.sidebar)
    return (
        <div>
            <div className={stateSidebar ? 'd-flex' : 'd-flex toggled'} id="wrapper">
                <StudentSidebar />
                <div id="page-content-wrapper">
                    <NavbarAdmin />
                    <HeaderStudent />
                    <Switch>
                        <Route exact path={match.path} component={ListPayments} />
                        {/* <Route exact path={`${match.path}/payments`} component={ListPayments} /> */}
                    </Switch>
                </div>
            </div>
        </div>
    )
}

export default RouterIndex