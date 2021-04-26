import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { sendSms } from '../../redux/actions/contactAction'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, FormGroup, Row, Col } from 'reactstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import { ToastConfirmSendSms } from '../../assets/alerts'
import * as yup from 'yup';

const formSchema = yup.object().shape({
    sms: yup.string().min(10, 'El contenido debe tener minimo 10 caracteres')
        .required('El contenido es obligatorio'),
})

export const ModalSendSms = ({ show, msg, user, toggle }) => {

    const [phoneTo, setPhoneTo] = useState('');
    const dispatch = useDispatch()

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    sms: msg
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    ToastConfirmSendSms(`Se enviará 1 mensaje de texto. deseas continuar?`)
                        .fire().then((result) => {
                            if (result.value) {
                                const message = {
                                    user: `${user.last_name} ${user.first_name} - ${user.student.code}`,
                                    sms: values.sms,
                                    phone_to: `+57${phoneTo}`
                                }
                                dispatch(sendSms(message, toggle))
                                formikBag.setSubmitting(false)
                            }
                        })
                }}

            >{({ values, isSubmittig, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader >
                            <i className="far fa-envelope mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>Envio de SMS</strong>
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='sms' placeholder="Contenido" type="textarea" style={{ height: '220px' }}
                                                value={values.sms}
                                                onBlur={handleBlur('sms')}
                                                onChange={handleChange('sms')} />
                                        </InputGroup>
                                        <ErrorMessage name="sms" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" disabled={isSubmittig || !isValid} type='submit' onClick={() => setPhoneTo(`${user.student.phone1}`)}>Enviar a {user.student.phone1}</Button>
                            <Button color="success" disabled={isSubmittig || !isValid} type='submit' onClick={() => setPhoneTo(`${user.student.phone2}`)}>Enviar a {user.student.phone2}</Button>
                            <Button color="secondary" onClick={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}

export default ModalSendSms
