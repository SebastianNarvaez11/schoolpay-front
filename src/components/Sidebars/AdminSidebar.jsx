import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Collapse } from 'reactstrap'
import logo from '../../assets/img/colegio.png';



const Sidebar = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const { current_user } = useSelector(state => state.authReducer)


    return (
        <div className='navbar-vertical fixed-left' id="sidebar-wrapper">
            <div className="sidebar-heading text-center mt-3 mb-5">
                <Link to='/'><img
                    className='pro-img'
                    alt="logo colegio"
                    src={logo}
                /></Link>
            </div>
            <ul className="list-group list-group-flush">
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                            <i className="fas fa-home mr-3 ml-3"></i> Inicio
                    </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/users' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/users' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                            <i className="fas fa-user-shield mr-3 ml-3" style={{ color: '#52bdfc' }}></i> Usuarios
                    </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/grades' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/grades' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                            <i className="fas fa-users mr-3 ml-3" style={{ color: '#faad14' }}></i> Grados
                    </NavLink>
                    </li>
                }

                <li className={isOpen ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(true)}>
                    <Link activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-balance-scale-left mr-3 ml-3" style={{ color: '#5257f2' }}></i> Control de Pagos
                    </Link>
                </li>
                <Collapse isOpen={isOpen}>
                    <li className={props.location.pathname === '/admin/payments/students' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/students' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-user-graduate mr-3 ml-3" style={{ color: '#5257f2' }}></i> Por Estudiante
                        </NavLink>
                    </li>
                    {current_user.type === 1 &&
                        <li className={props.location.pathname === '/admin/payments/grades' ? 'navActive' : 'navActiveHover'}>
                            <NavLink exact to='/admin/payments/grades' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                                <i className="fas fa-users mr-3 ml-3" style={{ color: '#5257f2' }}></i> Por Grado
                        </NavLink>
                        </li>
                    }
                    <li className={props.location.pathname === '/admin/compromises' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/compromises' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' style={{ background: '#f6f9fc' }}>
                            <i className="fas fa-calendar-check mr-3 ml-3" style={{ color: '#5257f2' }}></i> Compromisos
                        </NavLink>
                    </li>
                </Collapse>
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/list' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/list' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                            <i className="fas fa-dollar-sign mr-3 ml-3" style={{ color: '#6eb561' }}></i> Pagos
                    </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/general' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/general' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' >
                            <i className="fas fa-chart-pie mr-3 ml-3" style={{ color: '#f5365c' }}></i> Graficos
                        </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/reports' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/reports' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela' >
                            <i className="fas fa-file-excel mr-3 ml-3" style={{ color: '#2dce89' }}></i> Reportes
                        </NavLink>
                    </li>
                }
            </ul>
        </div>
    )
}

export default withRouter(Sidebar)

