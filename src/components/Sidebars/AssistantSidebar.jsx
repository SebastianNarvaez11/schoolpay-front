import React, { useState } from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import { Collapse } from 'reactstrap'
import logo from '../../assets/img/colegio.png';
import logoSP from '../../assets/img/logo_title.png';



const Sidebar = (props) => {

    const [isOpen, setIsOpen] = useState(false);

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
                <li className={props.location.pathname === '/assistant' ? 'navActive' : 'navActiveHover'} onClick={() => setIsOpen(false)}>
                    <NavLink exact to='/assistant' activeClassName='navActive' className="list-group-item list-group-item-action"
                        style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                        <div className={props.location.pathname === '/assistant' && "itemActive"}>
                            <i className="fas fa-home mr-4 ml-3" ></i>Inicio
                                {props.location.pathname === '/assistant' && <i className="fas fa-arrow-right ml-5" ></i>}
                        </div>
                    </NavLink>
                </li>
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
                    <li className={props.location.pathname === '/assistant/payments/students' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/assistant/payments/students' activeClassName='navActive' className="list-group-item list-group-item-action"
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/assistant/payments/students' && "itemActive"}>
                                <i className="fas fa-user-graduate mr-3 ml-3" ></i>Por Estudiante
                                {props.location.pathname === '/assistant/payments/students' && <i className="fas fa-arrow-right ml-3" ></i>}
                            </div>
                        </NavLink>
                    </li>
                    <li className={props.location.pathname === '/assistant/compromises' ? 'navActive' : 'navActiveHover'}>
                        <NavLink exact to='/assistant/compromises' activeClassName='navActive' className="list-group-item list-group-item-action"
                            style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                            <div className={props.location.pathname === '/assistant/compromises' && "itemActive"}>
                                <i className="fas fa-handshake mr-2 ml-3" ></i>Compromisos
                                {props.location.pathname === '/assistant/compromises' && <i className="fas fa-arrow-right ml-3" ></i>}
                            </div>
                        </NavLink>
                    </li>
                </Collapse>
            </ul>
            <div className="sidebar-heading text-center mb-4" style={{ position: 'fixed', bottom: 0, width: 100 }}>
                <Link to='/'><img
                    style={{ width: '170%', marginLeft: '25%' }}
                    alt="logo colegio"
                    src={logoSP}
                /></Link>
            </div>
        </div>
    )
}

export default withRouter(Sidebar)

