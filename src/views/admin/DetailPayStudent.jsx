import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import HeaderSearchStudent from '../../components/Headers/admin/HeaderSearchStudent'
import { BarPayment } from '../../components/Payment/BarPayment'
import { ModalSendEmail } from '../../components/Admin/ModalSendEmail'
import { ModalSendSms } from '../../components/Admin/ModalSendSms'
import { ModalSpinner } from '../../components/Spinner/ModalSpinner'
import ModalCreateCompromise from '../../components/Admin/ModalCreateCompromise'
import ModalListCompromise from '../../components/Admin/ModalListCompromise'
import { resetStudentSelect } from '../../redux/actions/studentActions'
import { createPaymentManual, deletePaymentManual } from '../../redux/actions/paymentActions'
import { scheduleFormat, formatNumber, initialCharge } from '../../helpers/functions.js'
import { email_recordatorio, sms_recordatorio } from '../../helpers/messages'
import { Table, Input as InputAnd, Button as ButtonAntd } from 'antd';
import {
    Card, CardHeader, Container, Row, Col, Spinner, FormGroup, InputGroup, InputGroupAddon, InputGroupText,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { updateStudent, deleteStudent } from '../../redux/actions/studentActions'
import { host } from '../../helpers/host'
import { ModalUpdateStudent } from '../../components/Admin/ModalUpdateStudent'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { Formik, Form, ErrorMessage } from 'formik'
import * as yup from 'yup';
import { ToastDelete } from '../../assets/alerts'
import axios from 'axios'
import Swal from 'sweetalert2'
import { PDFDownloadLink } from '@react-pdf/renderer'
import CompromisePDF from '../reports/CompromisePDF'


const formSchema = yup.object().shape({
    value: yup.number().min(0, 'El valor debe ser mayor a cero').required('Este campo es obligatorio')
})

export const DetailPayStudent = () => {

    const { student_full, isFetching } = useSelector(state => state.studentReducer)
    const { sending } = useSelector(state => state.contactReducer)
    const dispatch = useDispatch()

    // modal de creacion de compromiso
    const [showCompromise, setSchowCompromise] = useState(false)
    const toggleCompromise = () => setSchowCompromise(!showCompromise)

    // modal historial de compromisos
    const [showHistorial, setSchowHistorial] = useState(false)
    const toggleHistorial = () => setSchowHistorial(!showHistorial)

    // Logica para los modales de edicion
    const [showUpdate, setShowUpdate] = useState({
        show: false,
        data: null
    })

    const toggleOpenUpdate = (row) => {
        setShowUpdate({
            show: true,
            data: row
        })
    }

    const toggleCloseUpdate = () => {
        setShowUpdate({
            show: false,
            data: null
        })
    }

    // cambiar el estado del estudiante
    const toggleState = (row) => {
        row.is_active = !row.is_active
        let url = `${host}api/v1/users/update/${row.id}/`
        console.log(row)
        axios.put(url, row)
            .then(response => {
                dispatch(updateStudent(row.student, response.data, row.student.grade))
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    showConfirmButton: true,
                    text: Object.values(error.response.data)[0]
                })
            })
    }



    //logica para borrar
    const handleDeleteStudent = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar al estudiante "${row.first_name} ${row.last_name}" de forma permanente?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(resetStudentSelect())
                    row.is_active = false
                    row.deleted = true
                    row.student.grade = row.student.grade.id //se pasa el id para no pasar el objeto completo
                    let url = `${host}api/v1/users/student/update/${row.student.id}/`
                    axios.put(url, row.student)
                        .then(response => {
                            console.log(response.data)
                            dispatch(deleteStudent(response.data, row))
                        })
                        .catch(error => {
                            Swal.fire({
                                icon: 'error',
                                showConfirmButton: true,
                                text: Object.values(error.response.data)[0]
                            })
                        })
                }
            })
    }

    // //logica modal email
    const [modalEmail, setModalEmail] = useState({
        show: false,
        message: ''
    })

    const toggleCreateEmail = (msg) => {
        setModalEmail({
            show: !modalEmail.show,
            message: msg
        })
    }


    const [modalSms, setModalSms] = useState({
        show: false,
        message: ''
    })

    const toggleCreateSms = (msg) => {
        setModalSms({
            show: !modalSms.show,
            message: msg
        })
    }


    //efecto para limpiar el studen_select y el students_filter
    useEffect(() => {
        return () => {
            console.log('desmontado')
            dispatch(resetStudentSelect())
        }
    }, [dispatch])

    // borrar pago manual
    const handleDelete = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar este pago ?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deletePaymentManual(row.id))
                }
            })
    }


    const senWppSms = (sms, phone) => {
        let url = `https://api.whatsapp.com/send?phone=57${phone}&text=${sms}`
        window.open(url, 'Whatsapp', "width=500,height=500,scrollbars=NO")
    }

    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <InputAnd
                    placeholder='Buscar'
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <ButtonAntd
                    type="primary"
                    onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    size="small"
                    style={{ width: 90, marginRight: 8 }}
                >
                    Buscar
                </ButtonAntd>
                <ButtonAntd onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                    Limpiar
                </ButtonAntd>
            </div>
        ),
        filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) =>
            get(record, dataIndex)
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),

        render: text =>
            isequal(searchedColumn, dataIndex) ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text.toString()}
                />
            ) : (
                    text
                ),
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    };

    const handleReset = clearFilters => {
        clearFilters();
        setSearchText('');
    };

    const columns = [
        {
            title: 'Referencia',
            dataIndex: ['reference'],
            ...getColumnSearchProps("reference"),
            render: (text, row) => `${row.reference} `,
        },
        {
            title: 'Concepto',
            dataIndex: 'description',
            ...getColumnSearchProps("description"),
            render: (text, row) => `${row.description}`,
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            ...getColumnSearchProps("value"),
            render: (text, row) => `$${formatNumber(row.value)}`,
        },
        {
            title: 'Fecha',
            dataIndex: ['create'],
            ...getColumnSearchProps("create"),
            render: (text, row) => `${row.create}`,
        },
        {
            title: '',
            dataIndex: 'id',
            render: (text, row) => {
                return (
                    <Row>
                        <Col>{row.method === 'Manual' &&
                            <span style={{ fontSize: '20px', color: '#f5222d' }} onClick={() => handleDelete(row)}>
                                <i id='icon-button' className="far fa-trash-alt"></i>
                            </span>
                        }
                        </Col>
                    </Row>
                );
            },
        },
    ];




    return (
        <>
            <HeaderSearchStudent />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                {Object.keys(student_full).length === 0
                    ? <h3 className="d-flex justify-content-center mb-0 mt-5 font-varela" style={{ fontSize: '25px', position: 'relative' }}>Ingresa el codigo o nombre del estudiante </h3>
                    : <Card id='card_shadow' className="animate__animated animate__fadeIn">
                        <CardHeader className="border-0">
                            <h3 className="font-varela float-right" style={{ fontSize: '25px' }}>
                                {student_full.student.code}
                                <Row>
                                    <Col>
                                        <span style={{ fontSize: '20px', color: '#597ef7' }} onClick={() => toggleState(student_full)}>
                                            <i id='icon-button' className="fas fa-sync-alt rotateMe"></i>
                                        </span>

                                        <span style={{ fontSize: '20px', color: '#faad14' }} className='ml-4 mr-4' onClick={() => toggleOpenUpdate(student_full)}>
                                            <i id='icon-button' className="far fa-edit"></i>
                                        </span>

                                        <span style={{ fontSize: '20px', color: '#f5222d' }} onClick={() => handleDeleteStudent(student_full)}>
                                            <i id='icon-button' className="far fa-trash-alt"></i>
                                        </span>
                                    </Col>
                                </Row>
                            </h3>
                            <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>
                                {student_full.last_name + " " + student_full.first_name}
                            </h3>
                            <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela">{student_full.student.grade.name}</h5>
                            <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela">{scheduleFormat(student_full.student.schedule)}</h5>
                        </CardHeader>
                        <Container fluid>
                            <Row>
                                <Col lg="9" md="12" sm="12">
                                    {student_full.student.compromises.filter(compromise => compromise.state === 1).length !== 0 &&
                                        <>
                                            <h3 className="float-right mt--5 badge badge-warning text-wrap" style={{ fontSize: '14px' }}>
                                                Compromiso Pendinte: {student_full.student.compromises.filter(compromise => compromise.state === 1)[0].date_pay}
                                                <PDFDownloadLink className="btn btn-success btn-sm ml-3" document={<CompromisePDF compromise={student_full.student.compromises.filter(compromise => compromise.state === 1)[0]} student={student_full} />} fileName="somename.pdf">
                                                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : ' Descargar ')}
                                                </PDFDownloadLink>
                                            </h3>

                                        </>
                                    }
                                    <BarPayment student={student_full.student} />
                                    <Row>
                                        <Col lg="6" md="12" sm="12">
                                            <Card body className="mb-5">
                                                <Row>
                                                    <Col lg="6" md="6" sm="6">
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>No. Meses en mora: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>{student_full.student.monthOwed}</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Periodo de cobro: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>{initialCharge(student_full.student.initial_charge)}</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Valor de mensualidad: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>$ {formatNumber(student_full.student.monthly_payment)}</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Acudiente: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '12px' }}>{student_full.student.attending}</h5>
                                                        <br />
                                                    </Col>
                                                    <Col lg="6" md="6" sm="6">
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Valor en mora: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>$ {formatNumber(student_full.student.amountOwed)}</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Descuento mensual: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>{student_full.student.discount}%</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Telefonos: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '16px' }}>{student_full.student.phone1}-{student_full.student.phone2}</h5>
                                                        <br />
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '14px' }}>Correo: </h3>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela" style={{ fontSize: '12px' }}>{student_full.email}</h5>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </Col>
                                        <Col lg="6" md="12" sm="12">
                                            {isFetching
                                                ?
                                                <Spinner className="d-flex justify-content-center mb-5" color="primary" style={{ width: '3rem', height: '3rem', margin: 'auto' }} />
                                                :
                                                <Table className='table-responsive'
                                                    dataSource={student_full.student.payments}
                                                    columns={columns}
                                                    rowKey="id"
                                                    size="small"
                                                    pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
                                            }
                                        </Col>
                                    </Row>
                                </Col>

                                <Col lg="3" md="12" sm="12">
                                    {!student_full.student.coverage && <>
                                        <Formik
                                            initialValues={{
                                                value: student_full.student.monthly_payment,
                                                description: 'Pago manual'
                                            }}

                                            enableReinitialize

                                            validationSchema={formSchema}

                                            onSubmit={(values, formikBag) => {
                                                const payment = {
                                                    value: values.value,
                                                    reference: 'Pago Manual',
                                                    method: 'Manual',
                                                    description: values.description,
                                                    student: student_full.student.id
                                                }

                                                dispatch(createPaymentManual(payment))
                                                formikBag.setSubmitting(false)
                                            }}
                                        >{({ values, isSubmitting, handleBlur, handleChange, isValid }) => {
                                            return (
                                                <Form>
                                                    <Card body outline color="success">
                                                        <h3 className="mb-0 font-varela" style={{ fontSize: '16px' }}>Registrar Pago: </h3>
                                                        <FormGroup >
                                                            <InputGroup >
                                                                <Input name='description' placeholder="Concepto" type="text"
                                                                    value={values.description}
                                                                    onBlur={handleBlur('description')}
                                                                    onChange={handleChange('description')} />
                                                            </InputGroup>
                                                            <ErrorMessage name="description" render={msg => <div className='error-text'>{msg}</div>} />
                                                        </FormGroup>
                                                        <FormGroup >
                                                            <InputGroup className="mt--2">
                                                                <InputGroupAddon addonType="prepend">
                                                                    <InputGroupText>
                                                                        <i className="fas fa-dollar-sign" />
                                                                    </InputGroupText>
                                                                </InputGroupAddon>
                                                                <Input name='value' placeholder="Ingrese un valor" type="number"
                                                                    max={student_full.student.total_year - student_full.student.total_paid}
                                                                    value={values.value}
                                                                    onBlur={handleBlur('value')}
                                                                    onChange={handleChange('value')} />
                                                            </InputGroup>
                                                            <ErrorMessage name="value" render={msg => <div className='error-text'>{msg}</div>} />
                                                        </FormGroup>
                                                        <Button className="mt--2" color="success" type="submit" disabled={isSubmitting || !isValid}>Registrar</Button>
                                                    </Card>
                                                </Form>
                                            )
                                        }}
                                        </Formik>

                                        <Card body outline color="primary" className='mt-2'>
                                            <h3 className="mb-0 mt--2 font-varela" style={{ fontSize: '14px' }}>Compromisos de Pago: </h3>
                                            <Row>
                                                <Col lg='6'>
                                                    <Button className="mt-2 btn-block" color="primary" disabled={student_full.student.compromises.filter(compromise => compromise.state === 1).length !== 0} onClick={toggleCompromise}>Nuevo</Button>
                                                </Col>
                                                <Col lg='6'>
                                                    <Button className="mt-2 btn-block" color="warning" disabled={student_full.student.compromises.length === 0 && true} onClick={toggleHistorial}>Historial</Button>
                                                </Col>
                                            </Row>
                                        </Card>
                                    </>

                                    }

                                    <Row className="mt-2 mb-3 d-flex justify-content-center">
                                        <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                            <DropdownToggle>
                                                <span style={{ color: '#00e676' }}>
                                                    <i id='icon-button' className="fab fa-whatsapp fa-3x"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>{student_full.student.phone1}</DropdownItem>
                                                <DropdownItem onClick={() => senWppSms(sms_recordatorio(student_full), student_full.student.phone1)}>
                                                    Mensaje de Cobro
                                                </DropdownItem>
                                                <DropdownItem onClick={() => senWppSms(sms_recordatorio(student_full), student_full.student.phone1)}>
                                                    Mensaje de Cobro
                                                </DropdownItem>
                                                <DropdownItem disabled>{student_full.student.phone2}</DropdownItem>
                                                <DropdownItem onClick={() => senWppSms(sms_recordatorio(student_full), student_full.student.phone2)}>
                                                    Mensaje de Cobro
                                                </DropdownItem>
                                                <DropdownItem onClick={() => senWppSms(sms_recordatorio(student_full), student_full.student.phone2)}>
                                                    Mensaje de Cobro
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                            <DropdownToggle>
                                                <span style={{ color: '#f14336' }}>
                                                    <i id='icon-button' className="far fa-envelope fa-3x"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem
                                                    onClick={() => toggleCreateEmail(email_recordatorio(student_full))}>
                                                    Recordatorio de Meses en mora
                                                </DropdownItem>
                                                <DropdownItem disabled>Action</DropdownItem>
                                                <DropdownItem
                                                    onClick={() => toggleCreateEmail(email_recordatorio(student_full))}>
                                                    Circular de Cobro
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                            <DropdownToggle>
                                                <span style={{ color: '#f7c02e' }}>
                                                    <i id='icon-button' className="fas fa-sms fa-3x"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Action</DropdownItem>
                                                <DropdownItem
                                                    onClick={() => toggleCreateSms(sms_recordatorio(student_full))}>
                                                    Enviar SMS
                                                </DropdownItem>
                                                <DropdownItem disabled>Action</DropdownItem>
                                                <DropdownItem>Another Action</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>

                                        <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                            <DropdownToggle>
                                                <span style={{ color: '#297b8f' }}>
                                                    <i id='icon-button' className="fas fa-file-invoice-dollar fa-3x"></i>
                                                </span>
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem disabled>Action</DropdownItem>
                                                <DropdownItem>Another Action</DropdownItem>
                                                <DropdownItem disabled>Action</DropdownItem>
                                                <DropdownItem>Another Action</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </Row>

                                </Col>
                            </Row>
                        </Container>
                    </Card>
                }
                <ModalSendEmail show={modalEmail.show} msg={modalEmail.message} user={student_full} email={student_full.email} toggle={toggleCreateEmail} />
                <ModalSendSms show={modalSms.show} msg={modalSms.message} user={student_full} toggle={toggleCreateSms} />
                <ModalSpinner isLoading={sending} text={'Enviando ...'} />
                {student_full.student && <ModalCreateCompromise show={showCompromise} toggle={toggleCompromise} student={student_full} />}
                {student_full.student && <ModalListCompromise show={showHistorial} toggle={toggleHistorial} compromises={student_full.student.compromises} student={student_full} />}
                {showUpdate.data && <ModalUpdateStudent show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
            </Container >
        </>
    )
}

export default DetailPayStudent
