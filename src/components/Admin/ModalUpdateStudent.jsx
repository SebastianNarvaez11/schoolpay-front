import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateStudent } from '../../redux/actions/studentActions';
import { host } from '../../helpers/host'
import { Formik, Form, ErrorMessage } from 'formik';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, InputGroup, InputGroupAddon, InputGroupText, FormGroup, Row, Col, Label } from 'reactstrap';
import * as yup from 'yup';
import axios from 'axios'
import Swal from 'sweetalert2'

const digitsOnly = (value) => /^\d+$/.test(value)
const formSchema = yup.object().shape({
    username: yup.string().min(3, 'El nombre de usuario debe tener minimo 3 caracteres').required('El nombre de usuario es obligatorio'),
    email: yup.string().email('Ingrese un email valido').required('El email es obligatorio'),
    first_name: yup.string().min(2, 'El nombre debe tener minimo 2 caracteres')
        .test('alphabets', 'El nombre solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    last_name: yup.string().min(2, 'El apellido debe tener minimo 2 caracteres')
        .test('alphabets', 'El apellido solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El nombre es obligatorio'),
    document_type: yup.number().min(1, 'Seleccione un tipo de documento').required('Este campo es obligatorio'),
    document: yup.string().min(5, 'El documento debe tener minimo 5 caracteres')
        .test('Digits only', 'Este campo solo admite valores numericos ', digitsOnly)
        .required('El documento es obligatorio'),
    grade: yup.object().typeError('Seleccione un grado').required('Este campo es obligatorio'),
    schedule: yup.number().min(1, 'Seleccione una jornada').required('Este campo es obligatorio'),
    initial_charge: yup.number().min(2, 'Seleccione un periodo').required('Este campo es obligatorio'),
    attending: yup.string().min(2, 'Este campo debe tener minimo 2 caracteres')
        .test('alphabets', 'Este campo solo debe contener letras', (value) => { return /^[A-Za-zÑñ ]+$/.test(value); })
        .required('El acudiente es obligatorio'),
    discount: yup.number().min(0, 'El valor debe ser mayor o igual a cero').max(100, 'El porcentaje maximo de descuento es el 100%')
        .required('Si no desea asignar un descuento, digite el numero 0')
})


export const ModalUpdateStudent = ({ show, data, toggle }) => {

    const grades = useSelector(state => state.gradeReducer.grades)
    const dispatch = useDispatch()

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <Formik
                initialValues={{
                    username: data.username,
                    email: data.email,
                    first_name: data.first_name,
                    last_name: data.last_name,
                    type: '3',
                    grade: JSON.stringify(data.student.grade),
                    document_type: data.student.document_type,
                    document: data.student.document,
                    attending: data.student.attending,
                    phone1: data.student.phone1,
                    phone2: data.student.phone2,
                    discount: data.student.discount,
                    initial_charge: data.student.initial_charge,
                    coverage: data.student.coverage,
                    schedule: data.student.schedule,
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
                        password1: values.password1,
                        password2: values.password2
                    }

                    const student = {
                        ...data.student,
                        grade: JSON.parse(values.grade),
                        document_type: values.document_type,
                        document: values.document,
                        attending: values.attending,
                        phone1: values.phone1,
                        phone2: values.phone2,
                        discount: values.discount,
                        initial_charge: values.initial_charge,
                        coverage: values.coverage,
                        schedule: values.schedule
                    }

                    let url = `${host}api/v1/users/update/${user.id}/`
                    axios.put(url, user)
                        .then(response => {
                            student.user = response.data.id
                            dispatch(updateStudent(student, response.data, student.grade, toggle))
                        }).catch(error => {
                            console.log(error)
                            Swal.fire({
                                icon: 'error',
                                showConfirmButton: true,
                                text: Object.values(error.response.data)[0]
                            })
                        })
                        
                    formikBag.setSubmitting(false)
                    console.log(user)
                    console.log(student)
                    console.log(typeof (student.grade))
                }}

            >{({ values, handleBlur, handleChange, isSubmitting, isValid }) => {
                return (
                    <Form>
                        <ModalHeader>Actualizar Estudiante</ModalHeader>
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
                                <Col lg='4'>
                                    <FormGroup >
                                        <Input type="select" name="document_type"
                                            value={values.document_type}
                                            onBlur={handleBlur('document_type')}
                                            onChange={handleChange('document_type')}>
                                            <option value='0' disabled>Tipo de Documento.</option>
                                            <option value={1}>T.I</option>
                                            <option value={2}>R.C</option>
                                            <option value={3}>C.C</option>
                                        </Input>
                                        <ErrorMessage name="document_type" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='8'>
                                    <FormGroup >
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
                                        <Input type="select" name="grade"
                                            value={values.grade}
                                            onBlur={handleBlur('grade')}
                                            onChange={handleChange('grade')}>
                                            <option value='0' disabled>Seleccione un grado...</option>
                                            {grades.map(grade => (
                                                <option value={JSON.stringify(grade)}>{grade.name}</option>
                                            ))}
                                        </Input>
                                        <ErrorMessage name="grade" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <Input type="select" name="schedule"
                                            value={values.schedule}
                                            onBlur={handleBlur('schedule')}
                                            onChange={handleChange('schedule')}>
                                            <option value='0' disabled>Seleccione una jornada...</option>
                                            <option value={1}>Mañana</option>
                                            <option value={2}>Tarde</option>
                                            <option value={3}>Unica</option>
                                        </Input>
                                        <ErrorMessage name="schedule" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-user-tie"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='attending' placeholder="Acudiente" type="text"
                                                value={values.attending}
                                                onBlur={handleBlur('attending')}
                                                onChange={handleChange('attending')} />
                                        </InputGroup>
                                        <ErrorMessage name="attending" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='phone1' placeholder="Telefono 1" type="number"
                                                value={values.phone1}
                                                onBlur={handleBlur('phone1')}
                                                onChange={handleChange('phone1')} />
                                        </InputGroup>
                                        <ErrorMessage name="phone1" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <InputGroup className="mb-4">
                                            <Input name='phone2' placeholder="Telefono 2" type="number"
                                                value={values.phone2}
                                                onBlur={handleBlur('phone2')}
                                                onChange={handleChange('phone2')} />
                                        </InputGroup>
                                        <ErrorMessage name="phone2" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                    <Label>Descuento mensual (%):</Label>
                                        <InputGroup className="mb-4">
                                            <InputGroupAddon addonType="prepend">
                                                <InputGroupText>
                                                    <i className="fas fa-percentage"></i>
                                                </InputGroupText>
                                            </InputGroupAddon>
                                            <Input name='discount' placeholder="Descuento" type="number"
                                                value={values.discount}
                                                onBlur={handleBlur('discount')}
                                                onChange={handleChange('discount')} />
                                        </InputGroup>
                                        <ErrorMessage name="discount" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='6'>
                                    <FormGroup >
                                        <Label>Periodo de Cobro:</Label>
                                        <InputGroup className="mb-4">
                                            <Input type="select" name="initial_charge"
                                                value={values.initial_charge}
                                                onBlur={handleBlur('initial_charge')}
                                                onChange={handleChange('initial_charge')}>
                                                <option value='0' disabled>Seleccione un periodo...</option>
                                                <option value={10}>Febrero-Noviembre</option>
                                                <option value={9}>Marzo-Noviembre</option>
                                                <option value={8}>Abril-Noviembre</option>
                                                <option value={7}>Mayo-Noviembre</option>
                                                <option value={6}>Junio-Noviembre</option>
                                                <option value={5}>Julio-Noviembre</option>
                                                <option value={4}>Agosto-Noviembre</option>
                                                <option value={3}>Septiembre-Noviembre</option>
                                                <option value={2}>Octubre-Noviembre</option>
                                            </Input>
                                        </InputGroup>
                                        <ErrorMessage name="initial_charge" render={msg => <div className='error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                                <Col lg='12'>
                                    <FormGroup >
                                        <div className="custom-control custom-checkbox mb-3">
                                            <Input
                                                className="custom-control-input"
                                                id="customCheck1"
                                                type="checkbox"
                                                name='coverage'
                                                checked={values.coverage}
                                                value={values.coverage}
                                                onBlur={handleBlur('coverage')}
                                                onChange={handleChange('coverage')}
                                            />
                                            <Label className="custom-control-label" htmlFor="customCheck1">
                                                Covertura
                                            </Label>
                                        </div>
                                        <ErrorMessage name="coverage" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" type='submit' disabled={isSubmitting || !isValid}>Actualizar</Button>
                            <Button color="secondary" onClick={toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}

export default ModalUpdateStudent
