import React from 'react'
import { useDispatch } from 'react-redux'
import { sendEmail } from '../../redux/actions/contactAction'
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, FormGroup, Row, Col } from 'reactstrap';
import { Formik, Form, ErrorMessage } from 'formik';
import { ToastConfirmSendSms } from '../../assets/alerts'
import * as yup from 'yup';

const formSchema = yup.object().shape({
    content: yup.string().min(10, 'El contenido debe tener minimo 10 caracteres').max(900, 'El contenido del correo debe tener maximo 900 caracteres')
        .required('El contenido es obligatorio'),
})

export const ModalSendEmail = ({ show, msg, user, email, toggle }) => {

    const dispatch = useDispatch()

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    email_destination: email,
                    content: msg
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    ToastConfirmSendSms(`Se enviará 1 correo. deseas continuar?`)
                        .fire().then((result) => {
                            if (result.value) {
                                const email = {
                                    user: `${user.last_name} ${user.first_name} - ${user.student.code}`,
                                    email_destination: values.email_destination,
                                    content: values.content
                                }
                                dispatch(sendEmail(email, toggle))
                                formikBag.setSubmitting(false)
                            }
                        })
                }}

            >{({ values, isSubmittig, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader className='font-varela'>
                            <i className="far fa-envelope mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>Envio de Correos</strong>
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='content' placeholder="Contenido" type="textarea" style={{ height: '220px' }}
                                                maxLength='900'
                                                value={values.content}
                                                onBlur={handleBlur('content')}
                                                onChange={handleChange('content')} />
                                        </InputGroup>
                                        <ErrorMessage name="content" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" disabled={isSubmittig || !isValid} type='submit'>Enviar</Button>
                            <Button color="secondary" onClick={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}

export default ModalSendEmail
