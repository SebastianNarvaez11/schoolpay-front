import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Collapse } from 'reactstrap'
import logo from '../../assets/img/colegio.png';
import logoSP from '../../assets/img/logo_title.png';



const Sidebar = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const { current_user } = useSelector(state => state.authReducer)


    return (
        <div className='fixed-left'>
            <div className="sidebar-heading text-center mb-5">
                <Link to='/'><img
                    className='pro-img mt-5'
                    alt="logo colegio"
                    src={logo}
                /></Link>
            </div>
            <ul className="list-group list-group-flush">
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin' && "itemActive"}>
                                <i className="fas fa-home mr-4 ml-3" ></i>Inicio
                                {props.location.pathname === '/admin' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/users' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/users' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/users' && "itemActive"}>
                                <i className="fas fa-user-shield mr-4 ml-3" ></i>Usuarios
                                {props.location.pathname === '/admin/users' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/grades' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/grades' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/grades' && "itemActive"}>
                                <i className="fas fa-users mr-4 ml-3" ></i>Grados
                                {props.location.pathname === '/admin/grades' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }

                <li className={isOpen ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(!isOpen)}>
                    <Link activeClassName='navActive' className="list-group-item list-group-item-action" 
                        style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                        <div className={isOpen && "itemActive"}>
                            <i className="fas fa-balance-scale-left mr-4 ml-3" ></i>Control
                                {isOpen && <i className="fas fa-arrow-down ml-4" ></i>}
                        </div>
                    </Link>
                </li>
                <Collapse isOpen={isOpen}>
                    <li className={props.location.pathname === '/admin/payments/students' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/payments/students' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/payments/students' && "itemActive"}>
                                <i className="fas fa-user-graduate mr-3 ml-3" ></i>Por Estudiante
                                {props.location.pathname === '/admin/payments/students' && <i className="fas fa-arrow-right ml-3" ></i>}
                            </div>
                        </NavLink>
                    </li>
                    {current_user.type === 1 &&
                        <li className={props.location.pathname === '/admin/payments/grades' ? 'navActive' : 'navActiveHover'}>
                            <NavLink exact to='/admin/payments/grades' activeClassName='navActive' className="list-group-item list-group-item-action" 
                                style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                                <div className={props.location.pathname === '/admin/payments/grades' && "itemActive"}>
                                    <i className="fas fa-users mr-2 ml-3" ></i>Por Grado
                                    {props.location.pathname === '/admin/payments/grades' && <i className="fas fa-arrow-right ml-4" ></i>}
                                </div>
                            </NavLink>
                        </li>
                    }
                    <li className={props.location.pathname === '/admin/compromises' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/admin/compromises' activeClassName='navActive' className="list-group-item list-group-item-action text-wrap" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/compromises' && "itemActive"}>
                                <i className="fas fa-handshake mr-2 ml-3" ></i>Compromisos
                                {props.location.pathname === '/admin/compromises' && <i className="fas fa-arrow-right ml-3" ></i>}
                            </div>
                        </NavLink>
                    </li>
                </Collapse>
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/list' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/list' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/payments/list' && "itemActive"}>
                                <i className="fas fa-dollar-sign mr-4 ml-3" ></i>Pagos
                                {props.location.pathname === '/admin/payments/list' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/general' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/general' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/payments/general' && "itemActive"}>
                                <i className="fas fa-chart-pie mr-4 ml-3" ></i>Graficos
                                {props.location.pathname === '/admin/payments/general' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }
                {current_user.type === 1 &&
                    <li className={props.location.pathname === '/admin/payments/reports' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                        <NavLink exact to='/admin/payments/reports' activeClassName='navActive' className="list-group-item list-group-item-action" 
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/admin/payments/reports' && "itemActive"}>
                                <i className="fas fa-file-excel mr-4 ml-3" ></i>Reportes
                                {props.location.pathname === '/admin/payments/reports' && <i className="fas fa-arrow-right ml-5" ></i>}
                            </div>
                        </NavLink>
                    </li>
                }
            </ul>
            <div className="sidebar-heading text-center mb-4" style={{position: 'fixed', bottom: 0, width: 100}}>
                <Link to='/'><img
                    style={{width: '170%', marginLeft: '25%'}}
                    alt="logo colegio"
                    src={logoSP}
                /></Link>
            </div>
        </div>
    )
}

export default withRouter(Sidebar)

