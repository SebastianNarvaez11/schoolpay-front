import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { sendSmsMassive } from '../../redux/actions/contactAction'
import { Modal, ModalHeader, ModalFooter, ModalBody, Button, Form } from 'reactstrap';
import { ToastConfirmSendSms } from '../../assets/alerts'


export const ModalConfirmPhone = ({ show, selectedRow, msg, toggle }) => {

    const [phoneTo, setPhoneTo] = useState('');
    const dispatch = useDispatch()


    const onSubmit = (e) => {
        toggle()
        e.preventDefault()
        ToastConfirmSendSms(`Se enviarán ${selectedRow.length} mensajes de texto. deseas continuar?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(sendSmsMassive(selectedRow, msg, phoneTo))
                }
            })
    }

    return (
        <Modal isOpen={show} toggle={toggle} size='sm' centered>
            <Form onSubmit={onSubmit}>
                <ModalHeader >
                    <i className="far fa-envelope mr-1" style={{ fontSize: '20px' }}></i> <strong style={{ fontSize: '20px' }}>¿A que numero desea enviar los SMS?</strong>
                </ModalHeader>
                <ModalBody>
                    <Button color="success" type='submit' onClick={() => setPhoneTo('1')}>Telefono #1</Button>
                    <Button color="success" type='submit' onClick={() => setPhoneTo(`2`)}>Telefono #2</Button>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>Cancelar</Button>
                </ModalFooter>
            </Form>
        </Modal>
    )
}

export default ModalConfirmPhone
