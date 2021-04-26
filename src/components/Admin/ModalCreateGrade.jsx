import React from 'react'
import { useDispatch } from 'react-redux'
import { createGrade } from '../../redux/actions/gradeActions'
//components
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'


const formSchema = yup.object().shape({
    name: yup.string().min(3, 'El nombre debe tener minimo 3 caracteres').required('El nombre es obligatorio'),
    monthly_pay: yup.number().min(0, 'El valor debe ser mayor o igual a cero').required('Este campo es obligatorio'),
    enrollment: yup.number().min(0, 'El valor debe ser mayor o igual a cero').required('Este campo es obligatorio')
})



const ModalCreateGrade = ({ show, toggle }) => {

    const dispatch = useDispatch()

    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    name: '',
                    abbreviation: '',
                    monthly_pay: '',
                    enrollment: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const grade = {
                        name: values.name,
                        abbreviation: values.abbreviation,
                        monthly_pay: values.monthly_pay,
                        enrollment: values.enrollment,
                    }
                    dispatch(createGrade(grade, toggle))
                    formikBag.setSubmitting(false)
                }}
            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader>
                            <i className="fas fa-chalkboard-teacher mr-2" style={{ fontSize: '25px', color: '#faad14' }}></i> <strong style={{ fontSize: '20px' }}>Crear Grado</strong>
                        </ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-chalkboard-teacher" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='name' placeholder="Nombre" type="text"
                                                value={values.name}
                                                onBlur={handleBlur('name')}
                                                onChange={handleChange('name')} />
                                        </InputGroup>
                                        <ErrorMessage name="name" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-text-width" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='abbreviation' placeholder="Abreviación: Ej: 1°" type="text"
                                                maxlength={4}
                                                value={values.abbreviation}
                                                onBlur={handleBlur('abbreviation')}
                                                onChange={handleChange('abbreviation')} />
                                        </InputGroup>
                                        <ErrorMessage name="abbreviation" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-dollar-sign" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='monthly_pay' placeholder="Mensualidad" type="number"
                                                value={values.monthly_pay}
                                                onBlur={handleBlur('monthly_pay')}
                                                onChange={handleChange('monthly_pay')} />
                                        </InputGroup>
                                        <ErrorMessage name="monthly_pay" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-dollar-sign" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='enrollment' placeholder="Matricula" type="number"
                                                value={values.enrollment}
                                                onBlur={handleBlur('enrollment')}
                                                onChange={handleChange('enrollment')} />
                                        </InputGroup>
                                        <ErrorMessage name="enrollment" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" disabled={isSubmitting || !isValid} type='submit'>Crear</Button>
                            <Button color="secondary" onClick={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}


export default ModalCreateGrade
