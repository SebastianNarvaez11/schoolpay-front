import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/actions/authActions'
import {  Navbar, DropdownToggle, DropdownItem, UncontrolledDropdown, DropdownMenu, NavbarText, Row, Col } from 'reactstrap'

const NavbarAdmin = () => {
    const current_user = useSelector(state => state.authReducer.current_user)
    const dispatch = useDispatch()

    return (
        <Navbar className=" navbar-expand-lg pd-0 d-flex ">
            <Row className='row-white d-flex justify-content-end'>
                {/* <Col xl={4} lg={4}>
                    <Button id='button-sidebar' className='p-2 mb-1 bd-highlight' type="button">
                        <span className="navbar-toggler-icon" onClick={() => dispatch(toggleSidebar())} ></span>
                    </Button>
                </Col> */}
                <Col xl={12} lg={12}>
                    <div className='d-flex justify-content-end'>
                        <NavbarText className=' mr-3 p-2 bd-highlight '>
                            <span style={{fontSize: 18, fontWeight: 'bold'}}>{current_user.first_name} {current_user.last_name}</span></NavbarText>
                        <UncontrolledDropdown className='mb-1 bd-highlight'>
                            <DropdownToggle id='button-sidebar'>
                                <i id='fa-cog' className="fas fa-cog mt-2 mb-2 fa-lg" style={{color: '#6266ea'}}></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow mt-2" right>
                                <DropdownItem className="noti-title" header tag="div">
                                    <h6 className="text-overflow m-0">Bienvenido!</h6>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" >
                                    <i className="fas fa-headset" />
                                    <span>Soporte</span>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => dispatch(logoutUser())}>
                                    <i className="fas fa-sign-out-alt" />
                                    <span>Salir</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                </Col>
            </Row>




        </Navbar>
    );
}

export default NavbarAdmin;