import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NavbarGrades from '../../components/Headers/admin/NavbarGrades'
import { SmallBarPayment } from '../../components/Payment/SmallBarPayment'
import { ModalSpinner } from '../../components/Spinner/ModalSpinner'
import { ModalConfirmPhone } from '../../components/Admin/ModalConfirmPhone'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Row, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Col, Button, UncontrolledPopover, PopoverHeader, PopoverBody } from "reactstrap";
import { ToastConfirmSendSms } from '../../assets/alerts'
import { resetStudentSelect } from '../../redux/actions/studentActions'
import { sendEmailMassive } from '../../redux/actions/contactAction'
import { formatNumber, scheduleFormat } from '../../helpers/functions'
import { sms_recordatorio, email_recordatorio, wpp_recordatorio, wpp_cobro, wpp_recordatorio_examenes, wpp_cobro_citacion, wpp_boletines, wpp_control_ingreso } from '../../helpers/messages'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import Loader from "react-loader-spinner";
import search_img from '../../assets/img/search-img.png'
import { Chart as ChartGoogle } from "react-google-charts";

export const PaymentGrades = () => {

    const { isFetchingStudentByGrade, schedule_select, students_filter } = useSelector(state => state.studentReducer)
    const { sending } = useSelector(state => state.contactReducer)
    const { grade_select, isFetchingGrades } = useSelector(state => state.gradeReducer)
    const dispatch = useDispatch()

    // const en_mora = students_filter.filter(data => data.student.monthOwed !== 0).length
    const al_dia = students_filter.filter(data => data.student.monthOwed === 0).length
    const un_mes = students_filter.filter(data => data.student.monthOwed === 1).length
    const dos_meses = students_filter.filter(data => data.student.monthOwed === 2).length
    const tres_meses = students_filter.filter(data => data.student.monthOwed >= 3).length

    const [buttonActive, setButtonActive] = useState('')

    //efecto para limpiar el studen_select y el students_filter
    useEffect(() => {
        return () => {
            dispatch(resetStudentSelect())
        }
    }, [dispatch])

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


    //confirmacion de envio emails
    const sentEmails = (sms) => {
        ToastConfirmSendSms(`Se enviarán ${selectedRow.length} correos. deseas continuar?`)
            .fire().then((result) => {
                if (result.value) {
                    dispatch(sendEmailMassive(selectedRow, sms))
                }
            })
    }

    // envio de whatsapp
    const senWppSms = (sms, phone) => {
        let url = `https://api.whatsapp.com/send?phone=57${phone}&text=${sms}`
        window.open(url, 'Whatsapp', "width=500,height=500,scrollbars=NO")
    }



    //Logica para la datatable
    const [selectedRow, setselectedRow] = useState([])
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    // logica para la seleccion de la table
    const onSelectChange = (selectedRowKeys) => {
        setselectedRow(selectedRowKeys);
    }

    const rowSelection = {
        selectedRow,
        onChange: onSelectChange,
    };


    //logica para el buscador del table
    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
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
            title: 'Codigo',
            dataIndex: ['student', 'code'],
            ...getColumnSearchProps("student.code"),
            width: 90,
            render: (text, row) => `${row.student.code} `,
        },
        {
            title: 'Nombre',
            dataIndex: 'last_name',
            width: 200,
            ...getColumnSearchProps("last_name"),
            sorter: (a, b) => { return a.last_name.localeCompare(b.last_name) },
            sortDirections: ['ascend', 'descend'],
            render: (text, row) => `${row.last_name} ${row.first_name}`,
        },
        {
            title: 'Cobertura',
            dataIndex: ['student', 'coverage'],
            width: 100,
            filters: [
                {
                    text: 'Si',
                    value: true,
                },
                {
                    text: 'No',
                    value: false,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.student.coverage).indexOf(value) === 0,
            render: (text, row) => row.student.coverage ? 'SI' : 'NO'
        },
        {
            title: 'Meses en mora',
            dataIndex: 'meses',
            width: 120,
            sorter: (a, b) => { return a.student.monthOwed - b.student.monthOwed },
            filters: [
                {
                    text: '1 Mes',
                    value: 1,
                },
                {
                    text: '2 Meses',
                    value: 2,
                },
                {
                    text: '3 Meses',
                    value: 3,
                },
                {
                    text: '4 Meses',
                    value: 4,
                },
                {
                    text: '5 Meses',
                    value: 5,
                },
                {
                    text: '6 Meses',
                    value: 6,
                },
                {
                    text: '7 Meses',
                    value: 7,
                },
                {
                    text: '8 Meses',
                    value: 8,
                },
                {
                    text: '9 Meses',
                    value: 9,
                },
                {
                    text: '10 Meses',
                    value: 10,
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => record.student.monthOwed >= value,
            render: (text, row) => `${row.student.monthOwed}`,
        },
        {
            title: 'Valor en mora',
            dataIndex: 'valor',
            width: 100,
            sorter: (a, b) => { return a.student.amountOwed - b.student.amountOwed },
            render: (text, row) => `$ ${formatNumber(row.student.amountOwed)}`,
        },
        {
            title: 'Progreso',
            width: 300,
            dataIndex: 'meses',
            render: (text, row) => {
                return (
                    <SmallBarPayment student={row.student} />
                );
            }
        },
        // {
        //     title: 'Periodo',
        //     dataIndex: 'periodo',
        //     render: (text, row) => `${initialCharge(row.student.initial_charge)}`,
        // },
        {
            title: 'Acciones',
            dataIndex: 'id',
            width: 100,
            render: (text, row) => {
                return (
                    <>
                        {row.student.note !== '' &&
                            <>
                                <Button id={'UncontrolledPopover' + row.id} type="button" style={{ padding: '5px', backgroundColor: 'transparent', border: 0 }}>
                                    <i className="far fa-bell" style={{ color: '#1ea5f3', fontSize: '25px' }}></i>
                                </Button>
                                <UncontrolledPopover placement="right" target={'UncontrolledPopover' + row.id} trigger="focus">
                                    <PopoverHeader>Nota</PopoverHeader>
                                    <PopoverBody>{row.student.note}</PopoverBody>
                                </UncontrolledPopover>
                            </>
                        }
                        <UncontrolledDropdown direction="left" className="mt-1 mb-1" onClick={() => setButtonActive(row.id)}>
                            <DropdownToggle style={{ padding: '5px', backgroundColor: 'transparent', border: 0 }}>
                                <i id='icon-button' className="fab fa-whatsapp" style={{ color: buttonActive === row.id ? '#6266ea' : '#08e77a', fontSize: '25px' }}></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem disabled>{row.student.phone1}</DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio(row), row.student.phone1)}>
                                    Mensaje de Recordatorio
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_cobro(row), row.student.phone1)}>
                                    Mensaje de Cobro
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio_examenes(row), row.student.phone1)}>
                                    Recordatorio Examenes
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_boletines(row), row.student.phone1)}>
                                    Recordatorio Boletines
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_control_ingreso(row), row.student.phone1)}>
                                    Mensaje Control Ingreso
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_cobro_citacion(row), row.student.phone1)}>
                                    Mensaje Cobro Citacion
                                </DropdownItem>
                                <DropdownItem disabled>{row.student.phone2}</DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio(row), row.student.phone2)}>
                                    Mensaje de Recordatorio
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_cobro(row), row.student.phone2)}>
                                    Mensaje de Cobro
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio_examenes(row), row.student.phone2)}>
                                    Recordatorio Examenes
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_boletines(row), row.student.phone2)}>
                                    Recordatorio Boletines
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_control_ingreso(row), row.student.phone2)}>
                                    Mensaje Control Ingreso
                                </DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_cobro_citacion(row), row.student.phone2)}>
                                    Mensaje Cobro Citacion
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </>
                );
            },
        },
    ];


    return (
        <>
            {isFetchingGrades ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Grados</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <>
                    <NavbarGrades />
                    {isFetchingStudentByGrade ?
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
                            {Object.keys(grade_select).length === 0 ?
                                <>
                                    <div className='d-flex justify-content-center mt-7 animate__animated animate__fadeIn'>
                                        <img width='20%' alt="search" src={search_img} />
                                    </div>
                                    <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                        <h3 className="d-flex justify-content-center " style={{ fontSize: '15px', position: 'relative' }}>
                                            Selecciona un grado y una jornada
                                        </h3>
                                    </div>
                                </>
                                :
                                <Row style={{ paddingLeft: 30, paddingRight: 30 }}>
                                    <Col lg={9} md={9}>
                                        <div className='float-right mt--5'>
                                            <UncontrolledDropdown direction="left" className="mt-3">
                                                <DropdownToggle className='icon_shadown' style={{ backgroundColor: '#1ea5f3', border: 0, padding: 10 }} disabled={selectedRow.length === 0}>
                                                    <i className="fas fa-sms fa-2x"></i>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        onClick={() => toggleCreateSms(sms_recordatorio)}>
                                                        Recordatorio de Meses en mora
                                                    </DropdownItem>
                                                    <DropdownItem disabled>Action</DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                            <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                                <DropdownToggle className='icon_shadown' style={{ backgroundColor: '#e34133', border: 0, padding: 10 }} disabled={selectedRow.length === 0}>
                                                    <i className="far fa-envelope fa-2x"></i>
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem
                                                        onClick={() => sentEmails(email_recordatorio)}>
                                                        Recordatorio de Meses en mora
                                                    </DropdownItem>
                                                    <DropdownItem disabled>Action</DropdownItem>
                                                </DropdownMenu>
                                            </UncontrolledDropdown>
                                        </div>
                                        <Table style={{ width: '100%' }}
                                            className='animate__animated animate__fadeIn mt-5'
                                            dataSource={students_filter}
                                            rowSelection={rowSelection}
                                            columns={columns}
                                            rowKey={record => record}
                                            size="small"
                                            scroll={{ y: 600 }}
                                            pagination={false} />
                                    </Col>
                                    <Col lg={3} md={3} style={{ paddingLeft: 50 }} className='mt--6'>
                                        <div className='d-flex justify-content-center align-items-center mt-3'>
                                            <h1 style={{ fontSize: 80 }}>{grade_select.abbreviation}</h1>
                                            <h1 style={{ fontSize: 30 }} className="ml-3">{scheduleFormat(schedule_select)}</h1>
                                        </div>
                                        <Row>
                                            <Col lg={6} md={6} sm={12} className="d-flex justify-content-center">
                                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                                    <i class="fas fa-check fa-2x icon_shadown" style={{ backgroundColor: '#2ece89', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
                                                    <Col>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                            Al Día
                                                        </h5>
                                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                            {al_dia}
                                                        </span>
                                                    </Col>
                                                </div>
                                            </Col>
                                            <Col lg={6} md={6} sm={12} className="d-flex justify-content-center">
                                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                                    <i class="fas fa-exclamation-triangle fa-2x icon_shadown" style={{ backgroundColor: '#faad15', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
                                                    <Col>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                            1 Mes
                                                        </h5>
                                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                            {un_mes}
                                                        </span>
                                                    </Col>
                                                </div>
                                            </Col>
                                        </Row>

                                        <Row className='mt-2'>
                                            <Col lg={6} md={6} sm={12} className="d-flex justify-content-center">
                                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10, borderRadius: 10 }}>
                                                    <i class="fas fa-exclamation-circle fa-2x icon_shadown" style={{ backgroundColor: '#ff7042', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
                                                    <Col>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                            2 Meses
                                                        </h5>
                                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                            {dos_meses}
                                                        </span>
                                                    </Col>
                                                </div>
                                            </Col>
                                            <Col lg={6} md={6} sm={12} className="d-flex justify-content-center">
                                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 10, borderRadius: 10 }}>
                                                    <i class="fas fa-radiation-alt fa-2x icon_shadown" style={{ backgroundColor: '#f5242f', color: '#ffffff', padding: 8, borderRadius: 10, margin: 5 }}></i>
                                                    <Col>
                                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                            3 ó Mas
                                                        </h5>
                                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                            {tres_meses}
                                                        </span>
                                                    </Col>
                                                </div>
                                            </Col>
                                        </Row>

                                        <div className='card_shadown animate__animated animate__fadeIn mt-3' style={{ padding: 20, borderRadius: 20, height: 250 }}>
                                            <ChartGoogle
                                                width={'110%'}
                                                style={{ position: 'absolute', marginTop: -40, marginLeft: -40 }}
                                                height={400}
                                                chartType="PieChart"
                                                loader={<div>Loading Chart</div>}
                                                data={[
                                                    ['Task', 'Hours per Day'],
                                                    ['Al Día', al_dia],
                                                    ['1 Mes', un_mes],
                                                    ['2 Meses', dos_meses],
                                                    ['3 ó Mas', tres_meses],
                                                ]}
                                                options={{
                                                    pieHole: 0.4,
                                                    backgroundColor: 'transparent',
                                                    slices: {
                                                        0: { color: '#2dce89' },
                                                        1: { color: '#faad14' },
                                                        2: { color: '#ff6f41' },
                                                        3: { color: '#f5232e' },
                                                    },
                                                }}
                                                rootProps={{ 'data-testid': '3' }}
                                            />
                                        </div>
                                        <ModalSpinner isLoading={sending} text={'Enviando ...'} />
                                        <ModalConfirmPhone show={modalSms.show} selectedRow={selectedRow} msg={modalSms.message} toggle={toggleCreateSms} />
                                    </Col>
                                </Row>
                            }
                        </>
                    }
                </>
            }
        </>
    )
}

export default PaymentGrades
