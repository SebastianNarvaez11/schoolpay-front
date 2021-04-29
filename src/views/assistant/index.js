import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { fetchGrades } from "../../redux/actions/gradeActions";
import { fetchStudents } from "../../redux/actions/studentActions";
import { fetchCompromises } from '../../redux/actions/paymentActions'
import NavbarAdmin from "../../components/Navbars/NavbarAdmin";
import AssistantSidebar from "../../components/Sidebars/AssistantSidebar";
import Home from "../admin/Home";
import DetailPayStudent from "../admin/DetailPayStudent";
import ListCompromises from '../admin/ListCompromises'
import Error_404 from '../errors/Error_404'

const RouterIndex = ({ match }) => {
    const stateSidebar = useSelector((state) => state.uiReducer.sidebar);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchGrades());
        dispatch(fetchCompromises())
    }, [dispatch]);

    return (
        <div className={stateSidebar ? "d-flex" : "d-flex toggled"}
            id="wrapper" style={{ height: '100%' }}>
            <AssistantSidebar />
            <div id="page-content-wrapper" >
                <NavbarAdmin />
                <Switch >
                    <Route exact path={match.path} component={Home} />
                    <Route exact path={`${match.path}/payments/students`} component={DetailPayStudent} />
                    <Route exact path={`${match.path}/compromises`} component={ListCompromises} />
                    <Route path='*' component={Error_404} />
                </Switch>
            </div>
        </div>
    );
};

export default RouterIndex;