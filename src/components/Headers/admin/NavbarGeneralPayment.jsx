import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Container, Row, Col, FormGroup, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { sms_recordatorio, email_recordatorio } from '../../../helpers/messages'
import { ModalConfirmPhone } from '../../Admin/ModalConfirmPhone'
import { ModalSpinner } from '../../Spinner/ModalSpinner'
import { fetchDataGraphics } from '../../../redux/actions/studentActions'
import { ToastConfirmSendSms } from '../../../assets/alerts'
import { sendEmailMassive } from '../../../redux/actions/contactAction'

export const NavbarGeneralPayment = () => {

    const dispatch = useDispatch()
    const { data_graphics, isFetchingData } = useSelector(state => state.studentReducer)
    const { sending } = useSelector(state => state.contactReducer)
    const [value, setValue] = useState('0');

    useEffect(() => {
        if (data_graphics.length === 0) {
            dispatch(fetchDataGraphics())
        }
        //  eslint-disable-next-line
    }, [dispatch]);

    const changeFilter = (e) => {
        setValue(e.target.value)
    }

    const [modalSms, setModalSms] = useState({
        show: false,
        message: '',
        users: []
    })

    const toggleCreateSms = (msg) => {
        const users = data_graphics.filter(user => user.student.monthOwed >= value)
        setModalSms({
            show: !modalSms.show,
            message: msg,
            users: users
        })
    }


    //confirmacion de envio emails
    const sentEmails = (sms) => {
        const users = data_graphics.filter(user => user.student.monthOwed >= value)
        ToastConfirmSendSms(`Se enviarán ${users.length} correos. deseas continuar?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(sendEmailMassive(users, sms))
                }
            })
    }

    return (
        <>
            <div className="header bg-gradient-info pb-9  pt-md-4" >
                <Container >
                    <div className="header-body">
                        <Row className="d-flex justify-content-center">
                            <Col lg="6" xl="6">
                                <Card className="card-stats mt--5 mb-4">
                                    <CardBody>
                                        <Row>
                                            <h3 className="mb-0 font-varela ml-3" style={{ fontSize: '20px' }}>Filtro General</h3>
                                            <Col lg="12">
                                                <FormGroup className="mb--1">
                                                    <Input type="select" name="select" defaultValue="0" onChange={changeFilter} disabled={isFetchingData}>
                                                        <option disabled value="0">Seleccione filtro</option>
                                                        <option value="1">1 ó mas meses en mora</option>
                                                        <option value="2">2 ó mas meses en mora</option>
                                                        <option value="3">3 ó mas meses en mora</option>
                                                        <option value="4">4 ó mas meses en mora</option>
                                                        <option value="5">5 ó mas meses en mora</option>
                                                        <option value="6">6 ó mas meses en mora</option>
                                                        <option value="7">7 ó mas meses en mora</option>
                                                        <option value="8">8 ó mas meses en mora</option>
                                                        <option value="9">9 ó mas meses en mora</option>
                                                        <option value="10">10 meses en mora</option>
                                                    </Input>
                                                </FormGroup>
                                                <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                                    <DropdownToggle disabled={value === '0'}>
                                                        <span style={{ color: '#ffe000' }}>
                                                            <i id='icon-button' className="fas fa-sms fa-3x"></i>
                                                        </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem
                                                            onClick={() => toggleCreateSms(sms_recordatorio)}>
                                                            Recordatorio de Meses en mora
                                                </DropdownItem>
                                                        <DropdownItem disabled>Action</DropdownItem>
                                                        <DropdownItem>
                                                            Circular de Cobro
                                                </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                                <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                                    <DropdownToggle disabled={value === '0'}>
                                                        <span style={{ color: '#f14336' }}>
                                                            <i id='icon-button' className="far fa-envelope fa-3x"></i>
                                                        </span>
                                                    </DropdownToggle>
                                                    <DropdownMenu>
                                                        <DropdownItem onClick={() => sentEmails(email_recordatorio)}>
                                                            Recordatorio de Meses en mora
                                                </DropdownItem>
                                                        <DropdownItem disabled>Action</DropdownItem>
                                                        <DropdownItem
                                                            onClick={console.log()}>
                                                            Circular de Cobro
                                                </DropdownItem>
                                                    </DropdownMenu>
                                                </UncontrolledDropdown>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
                <ModalConfirmPhone show={modalSms.show} selectedRow={modalSms.users} msg={modalSms.message} toggle={toggleCreateSms} />
                <ModalSpinner isLoading={sending} text={'Enviando ...'} />
                <ModalSpinner isLoading={isFetchingData} text={'Cargando Datos ...'} />
            </div>
        </>
    )
}

export default NavbarGeneralPayment;