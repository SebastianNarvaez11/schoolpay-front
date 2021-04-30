import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { fetchGrades } from "../../redux/actions/gradeActions";
import { fetchStudents } from "../../redux/actions/studentActions";
// import { fetchAdminUsers } from "../../redux/actions/adminActions";
// import { fetchCompromises } from '../../redux/actions/paymentActions'
// import { fetchPayments } from '../../redux/actions/paymentActions'
import NavbarAdmin from "../../components/Navbars/NavbarAdmin";
import AdminSidebar from "../../components/Sidebars/AdminSidebar";
import Home from "./Home";
import ListUser from "./ListUser";
import ListGrades from "./ListGrades";
import DetailPayStudent from "./DetailPayStudent";
import PaymentGrades from "./PaymentGrades";
import PaymentGeneral from './PaymentGeneral'
import Reports from './Reports'
import ListPayments from './ListPayments'
import ListCompromises from './ListCompromises'
import Error_404 from '../errors/Error_404'


const RouterIndex = ({ match }) => {
    const stateSidebar = useSelector((state) => state.uiReducer.sidebar);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchGrades());
        // dispatch(fetchAdminUsers());
        // dispatch(fetchCompromises())
        // dispatch(fetchPayments())
    }, [dispatch]);

    return (
        <div className={stateSidebar ? "d-flex" : "d-flex toggled"}
            id="wrapper" style={{height: '100%'}}>
            <AdminSidebar />
            <div id="page-content-wrapper" >
                <NavbarAdmin />
                <Switch >
                    <Route exact path={match.path} component={Home} />
                    <Route exact path={`${match.path}/users`} component={ListUser} />
                    <Route exact path={`${match.path}/grades`} component={ListGrades} />
                    <Route exact path={`${match.path}/payments/students`} component={DetailPayStudent} />
                    <Route exact path={`${match.path}/payments/grades`} component={PaymentGrades} />
                    <Route exact path={`${match.path}/payments/general`} component={PaymentGeneral} />
                    <Route exact path={`${match.path}/payments/reports`} component={Reports} />
                    <Route exact path={`${match.path}/payments/list`} component={ListPayments} />
                    <Route exact path={`${match.path}/compromises`} component={ListCompromises} />
                    <Route path='*' component={Error_404} />
                </Switch>
            </div>
        </div>
    );
};

export default RouterIndex;