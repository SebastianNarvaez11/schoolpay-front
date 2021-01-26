import React from 'react'
import { useDispatch } from 'react-redux'
import { createAdmin} from '../../redux/actions/adminActions'
import { host } from '../../helpers/host'
//components
import { Formik, Form, ErrorMessage } from 'formik'
import axios from 'axios'
import Swal from 'sweetalert2'
import * as yup from 'yup';
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap'


const formSchema = yup.object().shape({
    username: yup.string().min(3, 'El nombre de usuario debe tener minimo 3 caracteres').required('El nombre de usuario es obligatorio'),
    email: yup.string().email('Ingrese un email valido').required('El email es obligatorio'),
    first_name: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres')
        .test('alphabets', 'El nombre solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    last_name: yup.string().min(2, 'El apellido debe tener minimo 2 caracteres')
        .test('alphabets', 'El apellido solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    type: yup.number().min(2, 'Seleccione un perfil').required('El perfil es obligatorio'),
    password1: yup.string().required('La contraseña es obligatoria'),
    password2: yup.string().oneOf([yup.ref('password1'), null], 'Las contraseñas no coinciden').required('Repita la contraseña')
})


const ModalCreateAdmin = ({ show, toggle }) => {

    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    username: '',
                    email: '',
                    first_name: '',
                    last_name: '',
                    type: '0',
                    position : '',
                    password1: '',
                    password2: ''
                }}

                validationSchema={formSchema}

                onSubmit={(values, formikBag) => {
                    const user = {
                        username: values.username,
                        email: values.email,
                        first_name: values.first_name,
                        last_name: values.last_name,
                        type: values.type,
                        password1: values.password1,
                        password2: values.password2
                    }

                    const admin = {
                        position : values.position
                    }

                    let url = `${host}api/v1/auth/registration/`
                    axios.post(url, user)
                        .then(response => {
                            console.log(response.data)
                            admin.user = response.data.user.id
                            dispatch(createAdmin(response.data.user, admin, toggle))
                        })
                        .catch(error => {
                            console.log(error)
                            Swal.fire({
                                icon: 'error',
                                showConfirmButton: true,
                                text: Object.values(error.response.data)[0]
                            })
                        })
                        
                    formikBag.setSubmitting(false)
                }}
                
            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader className='font-varela'>
                            <i className="fas fa-users mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>Crear Usuario</strong>
                        </ModalHeader>
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
                                            <option value={2}>Administrador</option>
                                            <option value={3}>Asistente</option>
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
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-key" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='password1' placeholder="Contraseña" type="password"
                                                value={values.password1}
                                                onBlur={handleBlur('password1')}
                                                onChange={handleChange('password1')} />
                                        </InputGroup>
                                        <ErrorMessage name="password1" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-key" />
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='password2' placeholder="Repite la contraseña" type="password"
                                                value={values.password2}
                                                onBlur={handleBlur('password2')}
                                                onChange={handleChange('password2')} />
                                        </InputGroup>
                                        <ErrorMessage name="password2" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
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


export default ModalCreateAdmin
