import React from 'react'
import { useDispatch } from 'react-redux'
//components
import { Formik, Form, ErrorMessage } from 'formik'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, FormGroup, InputGroup, Input } from 'reactstrap'
import { updateStudent } from '../../redux/actions/studentActions'



const ModalCreateNote = ({ show, toggle, data }) => {

    const dispatch = useDispatch()


    return (
        <Modal isOpen={show} toggle={toggle} >
            <Formik
                initialValues={{
                    note: data.student.note,
                }}

                onSubmit={(values, formikBag) => {
                    const student = {
                        ...data.student,
                        note: values.note
                    }
                    student.user = data.id

                    console.log(student)
                    dispatch(updateStudent(student, data, student.grade, toggle))
                    formikBag.setSubmitting(false)
                }}

            >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                return (
                    <Form>
                        <ModalHeader>
                            <i className="fas fa-bell mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>Crear Nota</strong>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup >
                                <InputGroup className="mb-4">
                                    <Input name='note' placeholder="Escribe una nota..." type="textarea"
                                        value={values.note}
                                        onBlur={handleBlur('note')}
                                        onChange={handleChange('note')} />
                                </InputGroup>
                                <ErrorMessage name="note" render={msg => <div className='mt--4 error-text'>{msg}</div>} />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="success" disabled={isSubmitting || !isValid} type='submit'>Actualizar</Button>
                            <Button color="secondary" onClick={toggle}>Cancelar</Button>
                        </ModalFooter>
                    </Form>
                )
            }}
            </Formik>
        </Modal>
    )
}


export default ModalCreateNote
