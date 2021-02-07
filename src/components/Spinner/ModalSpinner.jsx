import React from 'react'
import { Modal, ModalBody, Spinner } from 'reactstrap';

export const ModalSpinner = ({ isLoading, text }) => {
    return (
        <Modal isOpen={isLoading} backdrop centered className="animate__animated animate__zoomIn">
            <ModalBody>
                <Spinner className="d-flex justify-content-center mt-3" color="primary" style={{ width: '3rem', height: '3rem', margin: 'auto' }} />
                <h3 className="text-center font-varela" style={{fontSize : '20px' }}> {text} </h3>
                <p style={{textAlign : "center"}}>Por favor no recargue la pagina</p>
            </ModalBody>
        </Modal>
    )
}

export default ModalSpinner
