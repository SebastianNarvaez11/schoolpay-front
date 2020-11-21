import React, { useState } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Collapse } from 'reactstrap'
import logo from '../../assets/img/Imagen22.png';



const Sidebar = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div className='navbar-vertical fixed-left' id="sidebar-wrapper">
            <div className="sidebar-heading text-center mt-3 mb-5">
                <Link to='/'><img
                    className='pro-img'
                    alt=""
                    src={logo}
                /></Link>
            </div>
            <ul className="list-group list-group-flush">
                <li className={props.location.pathname === '/admin' ? 'navActive' : 'navActiveHover'}>
                    <NavLink exact to='/admin' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-home mr-3 ml-3"></i> Inicio
                    </NavLink>
                </li>
                <li className={props.location.pathname === '/admin/users' ? 'navActive' : 'navActiveHover'}>
                    <NavLink exact to='/admin/users' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-user mr-3 ml-3" style={{ color: '#52bdfc' }}></i> Usuarios
                    </NavLink>
                </li>
                <li className={props.location.pathname === '/admin/grades' ? 'navActive' : 'navActiveHover'}>
                    <NavLink exact to='/admin/grades' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-house-user mr-3 ml-3" style={{ color: '#faad14' }}></i> Grados
                    </NavLink>
                </li>
                <li className={isOpen ? 'navActive' : 'navActiveHover'} onClick={toggle}>
                    <Link activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-dollar-sign mr-3 ml-3" style={{ color: '#2dce89' }}></i> Control de pagos
                    </Link>
                </li>
                <Collapse isOpen={isOpen}>
                    <li className={props.location.pathname === '/admin/payments/students' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/students' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-chalkboard-teacher mr-3 ml-3" style={{ color: '#2dce89' }}></i> Por estudiante
                        </NavLink>
                    </li>
                    <li className={props.location.pathname === '/admin/payments/grades' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/grades' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-house-user mr-3 ml-3" style={{ color: '#2dce89' }}></i> Por grados
                        </NavLink>
                    </li>
                    <li className={props.location.pathname === '/admin/payments/general' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/general' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-users mr-3 ml-3" style={{ color: '#2dce89' }}></i> General
                        </NavLink>
                    </li>
                    <li className={props.location.pathname === '/admin/payments/reports' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/reports' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-users mr-3 ml-3" style={{ color: '#2dce89' }}></i> Reportes
                        </NavLink>
                    </li>
                </Collapse>

            </ul>
        </div>
    )
}

export default withRouter(Sidebar)

