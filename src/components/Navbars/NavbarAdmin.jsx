import React from "react";
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar } from '../../redux/actions/uiActions'
import { logoutUser } from '../../redux/actions/authActions'
import title from '../../assets/img/logo_title.png'
import { Button, Navbar, DropdownToggle, DropdownItem, UncontrolledDropdown, DropdownMenu, NavbarText, Row, Col } from 'reactstrap'

const NavbarAdmin = () => {
    const current_user = useSelector(state => state.authReducer.current_user)
    const dispatch = useDispatch()

    return (
        <Navbar className=" navbar-expand-lg navbar-light bg-blue  bd-highlight pd-0 d-flex ">
            <Row className='row-white'>
                <Col xl={4} lg={4}>
                    <Button id='button-sidebar' className='p-2 mb-1 bd-highlight' type="button">
                        <span className="navbar-toggler-icon" onClick={() => dispatch(toggleSidebar())} ></span>
                    </Button>
                </Col>
                <Col xl={4} lg={4}className='d-flex justify-content-center'>
                    <img alt="logo_de_schoolpay"   src={title} height='60' />
                </Col>
                <Col xl={4} lg={4}>
                    <div className='d-flex justify-content-end'>
                        <NavbarText className='text-white mr-3 p-2 bd-highlight font-varela'>{current_user.first_name} {current_user.last_name}</NavbarText>
                        <UncontrolledDropdown className='mb-1 bd-highlight'>
                            <DropdownToggle id='button-sidebar'>
                                <i id='fa-cog' className="fas fa-cog mt-2 mb-2 fa-lg"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow mt-2" right>
                                <DropdownItem className="noti-title" header tag="div">
                                    <h6 className="text-overflow m-0">Bienvenido!</h6>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" >
                                    <i className="ni ni-single-02" />
                                    <span>Mis Datos</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" >
                                    <i className="ni ni-settings-gear-65" />
                                    <span>Settings</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" >
                                    <i className="ni ni-calendar-grid-58" />
                                    <span>Activity</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" >
                                    <i className="ni ni-support-16" />
                                    <span>Support</span>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={() => dispatch(logoutUser())}>
                                    <i className="ni ni-user-run" />
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