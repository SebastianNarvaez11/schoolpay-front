import React from 'react'
import { useDispatch } from 'react-redux'
//components
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input, Label } from 'reactstrap'
import { createCompromise } from '../../redux/actions/paymentActions'

const digitsOnly = (value) => /^\d+$/.test(value)
const formSchema = yup.object().shape({
    person_charge: yup.string().min(2, 'Este campo debe tener minimo 2 caracteres')
        .test('alphabets', 'Este campo solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El responsable es obligatorio'),
    document: yup.string().min(5, 'El documento debe tener minimo 5 caracteres')
        .test('Digits only', 'Este campo solo admite valores numericos ', digitsOnly)
        .required('El documento es obligatorio'),
    value: yup.number().min(0, 'El valor debe ser mayor o igual a cero').required('Este campo es obligatorio'),
    month_owed: yup.number().min(0, 'El valor debe estar entre 1 y 10').required('Este campo es obligatorio'),
    date_pay: yup.date().required('La fecha es obligatoria').min(new Date(), "La fecha no debe ser menor o igual a la fecha actual")
})



const ModalCreateCompromise = ({ show, toggle, student }) => {

    const dispatch = useDispatch()

    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    person_charge: student.student.attending,
                    document: '',
                    month_owed: student.student.monthOwed,
                    value: student.student.amountOwed,
                    date_pay: '',
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const compromise = {
                        person_charge: values.person_charge,
                        document: values.document,
                        month_owed: values.month_owed,
                        value: values.value,
                        date_pay: values.date_pay,
                        student: student.student.id,
                        state: 1,
                    }
                    dispatch(createCompromise(compromise, toggle))
                    formikBag.setSubmitting(false)
                }}
            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader className='font-varela'>
                            <i className="fas fa-file-invoice-dollar mr-2" style={{ fontSize: '25px', color: '#faad14' }}></i> <strong style={{ fontSize: '20px' }}>Crear Compromiso de Pago</strong>
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg='12'>
                                    <FormGroup >
                                        <Label>Persona Responsable:</Label>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-user-tie"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='person_charge' placeholder="Responsable" type="text"
                                                value={values.person_charge}
                                                onBlur={handleBlur('person_charge')}
                                                onChange={handleChange('person_charge')} />
                                        </InputGroup>
                                        <ErrorMessage name="person_charge" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <Label>No. Documento:</Label>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-id-card" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='document' placeholder="Documento" type="number"
                                                value={values.document}
                                                onBlur={handleBlur('document')}
                                                onChange={handleChange('document')} />
                                        </InputGroup>
                                        <ErrorMessage name="document" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <Label>Cantidad De Mensualidades:</Label>
                                        <InputGroup className="mb-4">
                                            <Input name='month_owed' placeholder="# Mensualidades" type="number" min="1" max="10"
                                                value={values.month_owed}
                                                onBlur={handleBlur('month_owed')}
                                                onChange={handleChange('month_owed')} />
                                        </InputGroup>
                                        <ErrorMessage name="month_owed" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <Label>Valor:</Label>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-dollar-sign" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='value' placeholder="Valor" type="number"
                                                value={values.value}
                                                onBlur={handleBlur('value')}
                                                onChange={handleChange('value')} />
                                        </InputGroup>
                                        <ErrorMessage name="value" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <Label>Fecha Limite de Pago:</Label>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-dollar-sign" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='date_pay' placeholder="Fecha Limite De Pago" type="date"
                                                value={values.date_pay}
                                                onBlur={handleBlur('date_pay')}
                                                onChange={handleChange('date_pay')} />
                                        </InputGroup>
                                        <ErrorMessage name="date_pay" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" disabled={isSubmitting || !isValid} type='submit'>Crear</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}


export default ModalCreateCompromise
