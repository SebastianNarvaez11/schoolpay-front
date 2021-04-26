import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import SearchStudent from '../../components/Headers/admin/SearchStudent'
import { BarPayment } from '../../components/Payment/BarPayment'
import { ModalSendEmail } from '../../components/Admin/ModalSendEmail'
import { ModalSendSms } from '../../components/Admin/ModalSendSms'
import { ModalSpinner } from '../../components/Spinner/ModalSpinner'
import ModalCreateCompromise from '../../components/Admin/ModalCreateCompromise'
import ModalListCompromise from '../../components/Admin/ModalListCompromise'
import ModalCreateNote from '../../components/Admin/ModalCreateNote'
import { resetStudentSelect } from '../../redux/actions/studentActions'
import { createPaymentManual, deletePaymentManual, deleteCompromises, updateCompromiseSinceDetail } from '../../redux/actions/paymentActions'
import { scheduleFormat, formatNumber, initialCharge } from '../../helpers/functions.js'
import { email_recordatorio, sms_recordatorio, wpp_recordatorio, wpp_cobro } from '../../helpers/messages'
import { Table, Input as InputAnd, Button as ButtonAntd } from 'antd';
import {
    Row, Col, FormGroup, InputGroup, InputGroupAddon, InputGroupText,
    Input, Button, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledPopover, PopoverHeader, PopoverBody
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
import Loader from "react-loader-spinner";
import search_img from '../../assets/img/search-img.png'


const formSchema = yup.object().shape({
    value: yup.number().min(0, 'El valor debe ser mayor a cero').required('Este campo es obligatorio')
})

export const DetailPayStudent = () => {

    const { current_user } = useSelector(state => state.authReducer)
    const { student_full, isFetching } = useSelector(state => state.studentReducer)
    const { sending } = useSelector(state => state.contactReducer)
    const { isCreatingPayment } = useSelector(state => state.paymentReducer)
    const dispatch = useDispatch()

    // modal de creacion de compromiso
    const [showCompromise, setSchowCompromise] = useState(false)
    const toggleCompromise = () => setSchowCompromise(!showCompromise)

    // modal historial de compromisos
    const [showHistorial, setSchowHistorial] = useState(false)
    const toggleHistorial = () => setSchowHistorial(!showHistorial)

    // modal edicion de nota
    const [showNota, setShowNota] = useState({
        show: false,
        data: null
    })

    const toggleOpenNota = (row) => {
        setShowNota({
            show: true,
            data: row
        })
    }

    const toggleCloseNota = () => {
        setShowNota({
            show: false,
            data: null
        })
    }


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

    // borrar compromiso
    const handleDeleteCompromise = (row) => {
        ToastDelete(`¿ Esta seguro de eliminar este compromiso de pago ?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(deleteCompromises(row.id))
                }
            })
    }

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



    // logica para cambiar el estado del compromiso
    const toggleAccomplished = (row) => {
        if (row.state !== 3) {
            row.state = 3
            row.student = student_full.student.id
            dispatch(updateCompromiseSinceDetail(row))
        }
    }

    const toggleBreached = (row) => {
        if (row.state !== 2) {
            row.state = 2
            row.student = student_full.student.id
            dispatch(updateCompromiseSinceDetail(row))
        }
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
                    <>
                        {current_user.type === 1 &&
                            <>
                                {row.method === 'Manual' &&
                                    <span style={{ fontSize: '20px', color: '#f5222d' }} onClick={() => handleDelete(row)}>
                                        <i id='icon-button' className="far fa-trash-alt"></i>
                                    </span>
                                }
                            </>
                        }
                    </>
                );
            },
        },
    ];


    const renderIcons = () => {
        const n = student_full.student.monthOwed
        const e = student_full.student.amountOwed

        if (n >= 3) {
            return <i class="fas fa-exclamation-circle fa-2x icon_shadown" style={{ backgroundColor: '#f5232e', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
        }
        else if (n >= 1 || e !== 0) {
            return <i class="fas fa-exclamation-triangle fa-2x icon_shadown" style={{ backgroundColor: '#faad15', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
        }
        else if (n === 0) {
            return <i class="fas fa-check fa-2x icon_shadown" style={{ backgroundColor: '#2ece89', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
        }
    }



    return (
        <>
            {isFetching ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Estudiantes</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <>
                    <SearchStudent />
                    {Object.keys(student_full).length === 0 ?
                        <>
                            <div className='d-flex justify-content-center mt-9 animate__animated animate__fadeIn'>
                                <img width='20%' alt="search" src={search_img} />
                            </div>
                            <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                                    Ingresa el codigo o nombre del estudiante
                                </h3>
                            </div>
                        </>
                        :
                        <>
                            <Row className='ml-5'>
                                <Col lg={8} md={8}>
                                    <div className="animate__animated animate__fadeIn mb-3">
                                        <h3 className="mb-0 " style={{ fontSize: '30px' }}>
                                            <div className='d-flex justify-content-end'>
                                                {student_full.student.note !== '' &&
                                                    <div className='mr-3'>
                                                        <Button id="UncontrolledPopover" type="button" style={{ backgroundColor: '#1ea5f3', padding: 10, border: 0 }}>
                                                            <i className="fas fa-bell fa-lg"></i>
                                                        </Button>
                                                        <UncontrolledPopover placement="left" target="UncontrolledPopover" trigger="focus">
                                                            <PopoverHeader>Nota</PopoverHeader>
                                                            <PopoverBody>{student_full.student.note}</PopoverBody>
                                                        </UncontrolledPopover>
                                                    </div>
                                                }
                                                {student_full.last_name + " " + student_full.first_name}
                                            </div>
                                        </h3>
                                        <Row className='d-flex justify-content-between' style={{ paddingLeft: 12, paddingRight: 12 }}>
                                            <h3 style={{ fontSize: '30px' }}>{student_full.student.code}</h3>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 float-right" style={{ fontSize: '20px' }}>{student_full.student.grade.name}<br />{scheduleFormat(student_full.student.schedule)} </h5>
                                        </Row>

                                        {current_user.type === 1 &&
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
                                                    <span style={{ fontSize: '20px' }} className='float-right' onClick={() => toggleOpenNota(student_full)}>
                                                        <i id='icon-button' className="far fa-bell" style={{ color: '#1ea5f3' }}></i>
                                                    </span>
                                                </Col>
                                            </Row>
                                        }
                                        <Row className='d-flex justify-content-end' style={{ paddingLeft: 12, paddingRight: 12 }}>
                                            {student_full.student.compromises.filter(compromise => compromise.state === 1).length !== 0 &&
                                                <h3 className="badge badge-warning text-wrap d-flex align-items-center justify-content-end" style={{ fontSize: '14px', width: '50%' }}>
                                                    Compromiso Pendiente: {student_full.student.compromises.filter(compromise => compromise.state === 1)[0].date_pay}

                                                    <span style={{ fontSize: '20px', color: '#2dce89', marginLeft: 30, alignSelf: 'center' }}
                                                        onClick={() => toggleAccomplished(student_full.student.compromises.filter(compromise => compromise.state === 1)[0])}>
                                                        <i id='icon-button' className="fas fa-check"></i>
                                                    </span>

                                                    <span style={{ fontSize: '20px', color: '#f5222d', marginLeft: 30, alignSelf: 'center' }}
                                                        onClick={() => toggleBreached(student_full.student.compromises.filter(compromise => compromise.state === 1)[0])}
                                                    >
                                                        <i id='icon-button' className="fas fa-times"></i>
                                                    </span>

                                                    <PDFDownloadLink className="btn btn-success btn-sm ml-3" document={<CompromisePDF compromise={student_full.student.compromises.filter(compromise => compromise.state === 1)[0]} student={student_full} />} fileName="somename.pdf">
                                                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : ' Descargar ')}
                                                    </PDFDownloadLink>

                                                    <span style={{ fontSize: '20px', color: '#f5222d', marginLeft: 10, alignSelf: 'center' }}
                                                        onClick={() => handleDeleteCompromise(student_full.student.compromises.filter(compromise => compromise.state === 1)[0])}>
                                                        <i id='icon-button' className="far fa-trash-alt"></i>
                                                    </span>
                                                </h3>
                                            }
                                        </Row>
                                    </div>

                                    <BarPayment student={student_full.student} />
                                    <Row className='mt-4 mb-4'>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                {renderIcons()}
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        N. Meses en<br />Mora
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        {student_full.student.monthOwed}
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                {renderIcons()}
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        Valor en<br />Mora
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        $ {formatNumber(student_full.student.amountOwed)}
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                <i class="fas fa-piggy-bank fa-2x icon_shadown" style={{ backgroundColor: '#5257f2', color: '#ffffff', padding: 10, borderRadius: 10, margin: 5 }}></i>
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        Valor<br />Excedente
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        $ {formatNumber(student_full.student.total_paid - ((Math.floor(student_full.student.total_paid / student_full.student.monthly_payment) * student_full.student.monthly_payment)))}
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                <i class="fas fa-percentage fa-2x icon_shadown" style={{ backgroundColor: '#5257f2', color: '#ffffff', padding: 10, borderRadius: 10, margin: 5 }}></i>
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        Descuento<br />Mensual
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        {student_full.student.discount}%
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                <i class="fas fa-calendar-alt fa-2x icon_shadown" style={{ backgroundColor: '#5257f2', color: '#ffffff', padding: 10, borderRadius: 10, margin: 5 }}></i>
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        Periodo<br />De Cobro
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        {initialCharge(student_full.student.initial_charge)}
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                                <i class="fas fa-money-bill-alt fa-2x icon_shadown" style={{ backgroundColor: '#5257f2', color: '#ffffff', padding: 10, borderRadius: 10, margin: 5 }}></i>
                                                <Col>
                                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                                        Valor<br />Mensual
                                                    </h5>
                                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                        $ {formatNumber(student_full.student.monthly_payment)}
                                                    </span>
                                                </Col>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className='animate__animated animate__fadeIn'>
                                        <Col lg={4} md={4}>
                                            <h3 className="mb-0 " style={{ fontSize: '14px' }}>Acudiente: </h3>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ fontSize: '12px' }}>{student_full.student.attending}</h5>
                                        </Col>
                                        <Col lg={4} md={4}>
                                            <h3 className="mb-0 " style={{ fontSize: '14px' }}>Telefonos: </h3>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ fontSize: '12px' }}>{student_full.student.phone1}-{student_full.student.phone2}</h5>
                                        </Col>
                                        <Col lg={4} md={4}>
                                            <h3 className="mb-0 " style={{ fontSize: '14px' }}>Correo: </h3>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ fontSize: '12px' }}>{student_full.email}</h5>
                                        </Col>
                                    </Row>
                                    <h3 className="mt-3" style={{ fontSize: '20px' }}>Pagos Realizados</h3>
                                    <Row className='mt-1 animate__animated animate__fadeIn'>
                                        <Table style={{ width: '100%' }}
                                            dataSource={student_full.student.payments}
                                            columns={columns}
                                            rowKey="id"
                                            size="small"
                                            scroll={{ y: 180 }}
                                            pagination={false} />
                                    </Row>
                                    {showNota.data && <ModalCreateNote show={showNota.show} toggle={toggleCloseNota} data={showNota.data} />}
                                    <ModalSendEmail show={modalEmail.show} msg={modalEmail.message} user={student_full} email={student_full.email} toggle={toggleCreateEmail} />
                                    <ModalSendSms show={modalSms.show} msg={modalSms.message} user={student_full} toggle={toggleCreateSms} />
                                    <ModalSpinner isLoading={sending} text={'Enviando ...'} />
                                    {student_full.student && <ModalCreateCompromise show={showCompromise} toggle={toggleCompromise} student={student_full} />}
                                    {student_full.student && <ModalListCompromise show={showHistorial} toggle={toggleHistorial} compromises={student_full.student.compromises} student={student_full} />}
                                    {showUpdate.data && <ModalUpdateStudent show={showUpdate.show} data={showUpdate.data} toggle={toggleCloseUpdate} />}
                                </Col>
                                <Col lg={4} md={4} className='mt--7'>
                                    <div style={{ marginLeft: 60, marginRight: 50 }}>
                                        {!student_full.student.coverage &&
                                            <>
                                                {current_user.type === 1 &&
                                                    <div className='animate__animated animate__fadeIn mt-3' style={{ padding: 20, borderRadius: 20, backgroundColor: 'white', marginLeft: 50 }}>
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
                                                                    <h3 className="mb-2" style={{ fontSize: '16px' }}>
                                                                        <i className="icon_shadown fas fa-dollar-sign fa-2x float-right" style={{ color: '#ffffff', padding: 10, paddingLeft: 15, paddingRight: 15, marginTop: -34, backgroundColor: '#2ece89', borderRadius: 10 }}></i>
                                                                    Registrar Pago:
                                                                </h3>
                                                                    <FormGroup >
                                                                        <InputGroup id='input-group-form' className="input-group-alternative mb-4">
                                                                            <Input className="input_search" style={{ borderRadius: 20, backgroundColor: 'transparent', paddingLeft: 30 }}
                                                                                name='description' placeholder="Concepto" type="text"
                                                                                value={values.description}
                                                                                onBlur={handleBlur('description')}
                                                                                onChange={handleChange('description')} />
                                                                        </InputGroup>
                                                                        <ErrorMessage name="description" render={msg => <div className='error-text'>{msg}</div>} />
                                                                    </FormGroup>
                                                                    <FormGroup >
                                                                        <InputGroup id='input-group-form' className="input-group-alternative mb-4">
                                                                            <Input className="input_search" style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: 'transparent', paddingLeft: 30 }}
                                                                                name='value' placeholder="Ingrese un valor" type="number"
                                                                                max={student_full.student.total_year - student_full.student.total_paid}
                                                                                value={values.value}
                                                                                onBlur={handleBlur('value')}
                                                                                onChange={handleChange('value')} />
                                                                            <InputGroupAddon addonType="prepend">
                                                                                <InputGroupText style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'transparent' }}>
                                                                                    <i className="fas fa-dollar-sign" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                                                                                </InputGroupText>
                                                                            </InputGroupAddon>
                                                                        </InputGroup>
                                                                        <ErrorMessage name="value" render={msg => <div className='error-text'>{msg}</div>} />
                                                                    </FormGroup>
                                                                    <Button color="success" type="submit" disabled={isSubmitting || !isValid}>
                                                                        Registrar <i className="fas fa-arrow-right ml-5" ></i>
                                                                    </Button>
                                                                    {isCreatingPayment &&
                                                                        <div className='float-right animate__animated animate__fadeIn mt--3'>
                                                                            <Loader
                                                                                type="BallTriangle"
                                                                                color="#5257f2"
                                                                                height={60}
                                                                                width={60}
                                                                            />
                                                                        </div>
                                                                    }
                                                                </Form>
                                                            )
                                                        }}
                                                        </Formik>
                                                    </div>
                                                }
                                                <div className='animate__animated animate__fadeIn mt-5' style={{ padding: 20, borderRadius: 20, backgroundColor: 'white', marginLeft: 50 }}>
                                                    <h3 className="mb-2" style={{ fontSize: '16px' }}>
                                                        <i className="icon_shadown fas fa-handshake fa-2x float-right" style={{ color: '#ffffff', padding: 10, paddingLeft: 15, paddingRight: 15, marginTop: -34, backgroundColor: '#5257f2', borderRadius: 10 }}></i>
                                                    Compromisos:
                                                </h3>
                                                    <Row>
                                                        <Col lg='6'>
                                                            <Button className="mt-2 btn-block" style={{ backgroundColor: '#5257f2' }}
                                                                disabled={student_full.student.compromises.filter(compromise => compromise.state === 1).length !== 0}
                                                                onClick={toggleCompromise}>
                                                                <i className="fas fa-plus mr-2" ></i>Nuevo
                                                        </Button>
                                                        </Col>
                                                        <Col lg='6'>
                                                            <Button className="mt-2 btn-block" color="warning"
                                                                disabled={student_full.student.compromises.length === 0 && true}
                                                                onClick={toggleHistorial}>
                                                                <i className="fas fa-history mr-2" ></i>
                                                            Historial
                                                        </Button>
                                                        </Col>
                                                    </Row>
                                                </div>

                                                {current_user.type === 1 &&
                                                    <Row className="mt-5 mb-3 d-flex justify-content-center animate__animated animate__fadeIn" style={{ marginLeft: 50 }}>
                                                        <UncontrolledDropdown direction="up" className="mt-1 mb-1">
                                                            <DropdownToggle className='icon_shadown' style={{ backgroundColor: '#00e676', border: 0, padding: 10 }}>
                                                                <i className="fab fa-whatsapp fa-2x"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem disabled><h1 style={{ fontSize: 15 }}>{student_full.student.phone1}</h1></DropdownItem>
                                                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio(student_full), student_full.student.phone1)}>
                                                                    Mensaje de Recordatorio
                                                            </DropdownItem>
                                                                <DropdownItem onClick={() => senWppSms(wpp_cobro(student_full), student_full.student.phone1)}>
                                                                    Mensaje de Cobro
                                                            </DropdownItem>
                                                                <DropdownItem disabled><h1 style={{ fontSize: 15 }}>{student_full.student.phone2}</h1></DropdownItem>
                                                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio(student_full), student_full.student.phone2)}>
                                                                    Mensaje de Recordatorio
                                                            </DropdownItem>
                                                                <DropdownItem onClick={() => senWppSms(wpp_cobro(student_full), student_full.student.phone2)}>
                                                                    Mensaje de Cobro
                                                            </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>

                                                        <UncontrolledDropdown direction="up" className="mt-1 mb-1">
                                                            <DropdownToggle className='icon_shadown' style={{ backgroundColor: '#e34133', border: 0, padding: 10 }}>
                                                                <i className="far fa-envelope fa-2x"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem
                                                                    onClick={() => toggleCreateEmail(email_recordatorio(student_full))}>
                                                                    Recordatorio de Meses en mora
                                                            </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => toggleCreateEmail(email_recordatorio(student_full))}>
                                                                    Circular de Cobro
                                                </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>

                                                        <UncontrolledDropdown direction="up" className="mt-1 mb-1">
                                                            <DropdownToggle className='icon_shadown' style={{ backgroundColor: '#1ea5f3', border: 0, padding: 10 }}>
                                                                <i className="fas fa-sms fa-2x"></i>
                                                            </DropdownToggle>
                                                            <DropdownMenu>
                                                                <DropdownItem
                                                                    onClick={() => toggleCreateSms(sms_recordatorio(student_full))}>
                                                                    SMS de Recordatorio
                                                            </DropdownItem>
                                                                <DropdownItem
                                                                    onClick={() => toggleCreateSms(sms_recordatorio(student_full))}>
                                                                    SMS de Cobro
                                                            </DropdownItem>
                                                            </DropdownMenu>
                                                        </UncontrolledDropdown>
                                                    </Row>
                                                }
                                            </>
                                        }
                                    </div>
                                </Col>
                            </Row>

                        </>
                    }
                </>
            }
        </>
    )
}

export default DetailPayStudent
