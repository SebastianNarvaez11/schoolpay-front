import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import MD5 from "crypto-js/md5";
import { formatNumber } from '../../helpers/functions'
//components
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, Input, Label, Form } from 'reactstrap'



const ModalPayment = ({ show, referenceCode, toggle }) => {

    const current_user = useSelector(state => state.authReducer.current_user)
    const total_paid = current_user.student.total_paid
    const total_restante = current_user.student.total_year - total_paid
    const monthly_payment = current_user.student.monthly_payment
    const apiKey = '4Vj8eK4rloUd272L48hsrarnUA'

    const [useValue, setValue] = useState({
        quantity: 1,
        value: current_user.student.amountOwed,
        // eslint-disable-next-line
        key: MD5(apiKey + '~' + '508029' + '~' + referenceCode + '~' + String(monthly_payment) + '~' + 'COP').toString()
    })

    // eslint-disable-next-line
    const changeValue = (e) => {
        setValue({
            quantity: e.target.value,
            value: e.target.value,
            // eslint-disable-next-line
            key: MD5(apiKey + '~' + '508029' + '~' + referenceCode + '~' + String(monthly_payment * e.target.value) + '~' + 'COP').toString()
        })
    }

    console.log(referenceCode)
    return (
        <Modal isOpen={show} toggle={toggle} >
            <Form action='https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/' method='post'>
                <ModalHeader className='font-varela'>
                    <i className="fas fa-users mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>Pago</strong>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col lg='12'>
                            <FormGroup >
                                <Label>Descripcion:</Label>
                                <InputGroup className="mb-4">
                                    <Input name='description' placeholder="Ej: Mensualidades de Febrero y Marzo" type="text" maxLength={50} required />
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col lg='12'>
                            <FormGroup >
                                <Label>Cantidad de mensualidades a cancelar:</Label>
                                <InputGroup>
                                    <Input type="select" name="quantity" onChange={changeValue} defaultValue={current_user.student.amountOwed}>
                                        <option value={0} disabled>Seleccione una cantidad...</option>
                                        {(total_restante >= monthly_payment) && <option value={monthly_payment * 1}>1 Mensualidad</option>}
                                        {(total_restante >= monthly_payment * 2) && <option value={monthly_payment * 2}>2 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 3) && <option value={monthly_payment * 3}>3 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 4) && <option value={monthly_payment * 4}>4 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 5) && <option value={monthly_payment * 5}>5 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 6) && <option value={monthly_payment * 6}>6 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 7) && <option value={monthly_payment * 7}>7 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 8) && <option value={monthly_payment * 8}>8 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 9) && <option value={monthly_payment * 9}>9 Mensualidades</option>}
                                        {(total_restante >= monthly_payment * 10) && <option value={monthly_payment * 10}>10 Mensualidades</option>}
                                        {(current_user.student.amountOwed !== 0) && <option value={current_user.student.amountOwed}>Total Adeudado</option>}
                                        {(total_restante !== 0) && <option value={total_restante}>Total Restante</option>}
                                    </Input>
                                </InputGroup>
                            </FormGroup>
                        </Col>
                        <Col lg='12' className='d-flex justify-content-between'>
                            <strong className='font-varela' style={{ fontSize: '30px' }}>Total a pagar:</strong>
                            <strong className='font-varela' style={{ fontSize: '30px' }}>$ {formatNumber(useValue.value)}</strong>
                        </Col>
                        <Input name="merchantId" type="hidden" value="508029" />
                        <Input name="accountId" type="hidden" value="512321" />
                        <Input name="referenceCode" type="hidden" value={referenceCode} />
                        <Input name="amount" type="hidden" value={useValue.value} />
                        <Input name="tax" type="hidden" value="0" />
                        <Input name="taxReturnBase" type="hidden" value="0" />
                        <Input name="currency" type="hidden" value="COP" />
                        <Input name="signature" type="hidden" value={useValue.key} />
                        <Input name="test" type="hidden" value="1" />
                        <Input name="buyerEmail" type="hidden" value={current_user.email} />
                        <Input name="buyerFullName" type="hidden" value={current_user.first_name + ' ' + current_user.last_name} />
                        <Input name="extra1" type="hidden" value={current_user.student.id} />
                        <Input name="responseUrl" type="hidden" value="http://localhost:3000/student/payments" />
                        <Input name="confirmationUrl" type="hidden" value="https://schoolpay.herokuapp.com/api/v1/payments/student/create/" />
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="success" type='submit'>Pagar</Button>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}


export default ModalPayment
