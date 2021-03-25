import React from 'react'
import { useDispatch } from 'react-redux'
import { Modal, ModalBody, ModalFooter, ModalHeader, Button, Container, Row, Col } from 'reactstrap'
import { formatNumber } from '../../helpers/functions'
import { Table } from 'antd';
import { ToastDelete } from '../../assets/alerts'
import { deleteCompromises } from '../../redux/actions/paymentActions'



const ModalListCompromise = ({ show, toggle, compromises, student }) => {

    const dispatch = useDispatch()
    
    const handleDeleteCompromise = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar este compromiso de pago ?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteCompromises(row.id))
                }
            })
    }


    const columns = [
        {
            title: 'Responsable',
            dataIndex: ['person_charge'],
            render: (text, row) => `${row.person_charge} `,
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            render: (text, row) => `$ ${formatNumber(row.value)}`,
        },
        {
            title: 'Fecha de Creacion',
            dataIndex: 'create',
            render: (text, row) => `${row.create}`,
        },
        {
            title: 'Fecha Estipulada',
            dataIndex: 'date_pay',
            render: (text, row) => `${row.date_pay}`,
        },
        {
            title: 'Estado',
            dataIndex: 'state',
            filters: [
                {
                    text: 'Pendiente',
                    value: 1,
                },
                {
                    text: 'Incumplido',
                    value: 2,
                },
                {
                    text: 'Cumplido',
                    value: 3,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.state).indexOf(value) === 0,
            render: (text, row) => {
                return (
                    <>
                        {row.state === 1 && <div className="badge badge-warning text-wrap">Pendiente</div>}
                        {row.state === 2 && <div className="badge badge-danger text-wrap">Incumplido</div>}
                        {row.state === 3 && <div className="badge badge-success text-wrap">Cumplido</div>}
                    </>
                )
            }

        },
        {
            title: 'Acciones',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <Row>
                        <Col>
                            <span style={{ fontSize: '20px', color: '#f5222d' }}
                                onClick={() => handleDeleteCompromise(row)}>
                                <i id='icon-button' className="far fa-trash-alt"></i>
                            </span>
                        </Col>
                    </Row>
                );
            },
        },
    ];

    return (
        <Modal isOpen={show} toggle={toggle} size='lg'>
            <ModalHeader className='font-varela'>
                <i className="fas fa-file-invoice-dollar mr-2" style={{ fontSize: '25px', color: '#faad14' }}></i> <strong style={{ fontSize: '20px' }}>Historial de Compromisos</strong>
            </ModalHeader>
            <ModalBody>
                <Container fluid>
                    <Table className='table-responsive'
                        dataSource={compromises}
                        columns={columns}
                        rowKey="id"
                        pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
                </Container>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>Cerrar</Button>
            </ModalFooter>
        </Modal>
    )
}
export default ModalListCompromise
