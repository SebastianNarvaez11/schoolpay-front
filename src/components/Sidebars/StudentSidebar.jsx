import React from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import logo from '../../assets/img/logosp2.png';



const Sidebar = (props) => {
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
                <li className={props.location.pathname === '/student' ? 'navActive' : 'navActiveHover'}>
                    <NavLink exact to='/student' activeClassName='navActive' className="list-group-item list-group-item-action" id='font-varela'>
                        <i className="fas fa-home mr-3 ml-3"></i> Inicio
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default withRouter(Sidebar)

