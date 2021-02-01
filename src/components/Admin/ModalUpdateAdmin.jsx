import React from 'react'
import { useDispatch } from 'react-redux';
import { updateAdmin } from '../../redux/actions/adminActions';
import { host } from '../../helpers/host'
import { Formik, Form, ErrorMessage } from 'formik';
import * as yup from 'yup';
import axios from 'axios'
import Swal from 'sweetalert2'

import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Row, Col } from 'reactstrap';

const formSchema = yup.object().shape({
    username: yup.string().min(3, 'El nombre de usuario debe tener minimo 3 caracteres').required('El nombre de usuario es obligatorio'),
    email: yup.string().email('Ingrese un email valido').required('El email es obligatorio'),
    first_name: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres')
        .test('alphabets', 'El nombre solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    last_name: yup.string().min(2, 'El apellido debe tener minimo 2 caracteres')
        .test('alphabets', 'El apellido solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    type: yup.number().min(1, 'Seleccione un perfil').required('El perfil es obligatorio'),
})

const ModalUpdateAdmin = ({ show, data, toggle }) => {

    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    type: data.type,
                    position: data.admin.position
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const user = {
                        ...data,
                        username: values.username,
                        email: values.email,
                        first_name: values.first_name,
                        last_name: values.last_name,
                        type: values.type,
                    }
                    const admin = {
                        ...data.admin,
                        position: values.position
                    }
                    console.log(user)
                    console.log(admin)


                    let url = `${host}api/v1/users/update/${user.id}/`
                    axios.put(url, user)
                        .then(response => {
                            console.log(response.data)
                            dispatch(updateAdmin(admin, response.data, toggle))
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                showConfirmButton: true,
                                text: Object.values(error.response.data)[0]
                            })
                        })
                    // dispatch(updateAdmin(user, toggle))
                    formikBag.setSubmitting(false)
                }}

            >{({ values, handleBlur, handleChange, isSubmitting, isValid }) => {
                return (
                    <Form>
                        <ModalHeader>Actualizar Usuario</ModalHeader>
                        <ModalBody>
                            <Row>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-user" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='username' placeholder="Username" type="text"
                                                value={values.username}
                                                onBlur={handleBlur('username')}
                                                onChange={handleChange('username')} />
                                        </InputGroup>
                                        <ErrorMessage name="username" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='first_name' placeholder="Nombres" type="text"
                                                value={values.first_name}
                                                onBlur={handleBlur('first_name')}
                                                onChange={handleChange('first_name')} />
                                        </InputGroup>
                                        <ErrorMessage name="first_name" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='last_name' placeholder="Apellidos" type="text"
                                                value={values.last_name}
                                                onBlur={handleBlur('last_name')}
                                                onChange={handleChange('last_name')} />
                                        </InputGroup>
                                        <ErrorMessage name="last_name" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-envelope" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='email' placeholder="Email" type="text"
                                                value={values.email}
                                                onBlur={handleBlur('email')}
                                                onChange={handleChange('email')} />
                                        </InputGroup>
                                        <ErrorMessage name="email" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <Input type="select" name="type"
                                            value={values.type}
                                            onBlur={handleBlur('type')}
                                            onChange={handleChange('type')}>
                                            <option value='0' disabled>Seleccione un perfil...</option>
                                            <option value={1}>Administrador</option>
                                            <option value={2}>Asistente</option>
                                        </Input>
                                        <ErrorMessage name="type" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='position' placeholder="Cargo" type="text"
                                                value={values.position}
                                                onBlur={handleBlur('position')}
                                                onChange={handleChange('position')} />
                                        </InputGroup>
                                        <ErrorMessage name="position" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" type='submit' disabled={isSubmitting || !isValid}>Actualizar</Button>
                            <Button color="secondary" onClick={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}

export default ModalUpdateAdmin
