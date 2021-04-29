import React from 'react'
import { NavLink, Link, withRouter } from 'react-router-dom'
import logo from '../../assets/img/colegio.png';
import logoSP from '../../assets/img/logo_title.png';



const Sidebar = (props) => {
    return (
        <div className='fixed-left'>
            <div className="sidebar-heading text-center mt-3 mb-5">
                <Link to='/'><img
                    className='pro-img'
                    alt="logo colegio"
                    src={logo}
                /></Link>
            </div>
            <ul className="list-group list-group-flush">
                <li className={props.location.pathname === '/student' ? 'navActive' : 'navActiveHover'}>
                    <NavLink exact to='/student' activeClassName='navActive' className="list-group-item list-group-item-action"
                        style={{ backgroundColor: 'transparent', borderBottom: 0 }}>
                        <div className={props.location.pathname === '/student' && "itemActive"}>
                            <i className="fas fa-home mr-4 ml-3" ></i>Inicio
                                {props.location.pathname === '/student' && <i className="fas fa-arrow-right ml-5" ></i>}
                        </div>
                    </NavLink>
                </li>
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

