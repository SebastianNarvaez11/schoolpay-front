import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
//components
import { Table, Input as InputAntd, Button as ButtonAntd } from 'antd';
import { Row, Col, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, } from "reactstrap";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { formatNumber } from '../../helpers/functions'
import { wpp_recordatorio_compromiso } from '../../helpers/messages'
import { fetchCompromises, updateCompromiseSinceList, getStudentFullCompromise, resetStudentFullCompromises } from '../../redux/actions/paymentActions'
import Loader from "react-loader-spinner";
import SmallBarPayment from '../../components/Payment/SmallBarPayment'
import search_student from '../../assets/img/search-student.png'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'


const ListCompromises = () => {

    const { compromises, isFetchingCompromises, isFetchingStudentFull, studentFull } = useSelector(state => state.paymentReducer)
    const dispatch = useDispatch()

    useEffect(() => {
        if (compromises.length === 0) {
            dispatch(fetchCompromises())
        }
        // eslint-disable-next-line
    }, [compromises.length])

    const pendientes = compromises.filter(compromise => compromise.state === 1).length
    const incumplidos = compromises.filter(compromise => compromise.state === 2).length
    const cumplidos = compromises.filter(compromise => compromise.state === 3).length

    const [buttonActive, setButtonActive] = useState('')

    useEffect(() => {
        if (compromises.length !== 0) {
            const table = window.document.querySelectorAll('table');
            table[1].setAttribute('id', 'table-report');
        }

    }, [compromises.length])

    const toggleAccomplished = (row) => {
        if (row.state !== 3) {
            row.state = 3
            row.student = row.student.id
            dispatch(updateCompromiseSinceList(row))
        }
    }

    const toggleBreached = (row) => {
        if (row.state !== 2) {
            row.state = 2
            row.student = row.student.id
            dispatch(updateCompromiseSinceList(row))
        }
    }

    const togglepPending = (row) => {
        if (row.state !== 1) {
            row.state = 1
            row.student = row.student.id
            dispatch(updateCompromiseSinceList(row))
        }
    }

    //efecto para limpiar el studenFull
    useEffect(() => {
        return () => {
            console.log('desmontado')
            dispatch(resetStudentFullCompromises())
        }
    }, [dispatch])


    // envio de whatsapp
    const senWppSms = (sms, phone) => {
        let url = `https://api.whatsapp.com/send?phone=57${phone}&text=${sms}`
        window.open(url, 'Whatsapp', "width=500,height=500,scrollbars=NO")
    }

    const renderIcons = () => {
        const n = studentFull.student.monthOwed
        const e = studentFull.student.amountOwed

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


    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <InputAntd
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
            title: 'Estudiante',
            width: 200,
            dataIndex: ['student', 'user', 'last_name'],
            render: (text, row) => `${(row.student.user.last_name).toUpperCase()} ${(row.student.user.first_name).toUpperCase()} `,
        },
        {
            title: 'Grado',
            width: 100,
            dataIndex: ['student', 'gtade', 'name'],
            render: (text, row) => `${row.student.grade.name}`,
        },
        {
            title: 'Valor',
            dataIndex: 'value', width: 100,
            ...getColumnSearchProps("value"),
            render: (text, row) => `$ ${formatNumber(row.value)}`,
        },
        {
            title: 'Mensualidades a Pagar',
            dataIndex: 'month_owed', width: 100,
            ...getColumnSearchProps("month_owed"),
            render: (text, row) => `${row.month_owed}`,
        },
        {
            title: 'Fecha Creacion',
            dataIndex: 'create', width: 100,
            ...getColumnSearchProps("create"),
            render: (text, row) => `${row.create}`,
        },
        {
            title: 'Fecha Estipulada',
            dataIndex: 'date_pay', width: 100,
            ...getColumnSearchProps("date_pay"),
            render: (text, row) => `${row.date_pay}`,
        },
        {
            title: 'Estado',
            dataIndex: 'state', width: 100,
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
            dataIndex: 'id', width: 130,
            render: (text, row) => {
                return (
                    <>
                        <span style={{ fontSize: '20px', color: '#2dce89' }} onClick={() => toggleAccomplished(row)}>
                            <i id='icon-button' className="fas fa-check"></i>
                        </span>

                        <span style={{ fontSize: '20px', color: '#f5222d', marginLeft: 15, marginRight: 15 }} onClick={() => toggleBreached(row)}>
                            <i id='icon-button' className="fas fa-times"></i>
                        </span>

                        <span style={{ fontSize: '20px', color: '#faad14', marginRight: 15 }} onClick={() => togglepPending(row)}>
                            <i id='icon-button' className="far fa-clock"></i>
                        </span>

                        <UncontrolledDropdown direction="left" className="mt-1 mb-1" onClick={() => setButtonActive(row.id)}>
                            <DropdownToggle style={{ padding: '5px', backgroundColor: 'transparent', border: 0 }}>
                                <i id='icon-button' className="fab fa-whatsapp" style={{ color: buttonActive === row.id ? '#6266ea' : '#08e77a', fontSize: '25px' }}></i>
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem disabled>{row.student.phone1}</DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio_compromiso(row), row.student.phone1)}>
                                    Mensaje de Recordatorio
                                </DropdownItem>
                                <DropdownItem disabled>{row.student.phone2}</DropdownItem>
                                <DropdownItem onClick={() => senWppSms(wpp_recordatorio_compromiso(row), row.student.phone2)}>
                                    Mensaje de Recordatorio
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
            {isFetchingCompromises ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Compromisos</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                : <Row style={{ paddingLeft: 30, paddingRight: 30 }}>
                    <Col lg={9} md={9}>
                        <Row className='mb-4'>
                            <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                    <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#2dce89', padding: 5, borderRadius: 10 }}>
                                        <i class="fas fa-check fa-3x"></i>
                                    </span>
                                    <Col>
                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                            Cumplidos
                                                </h5>
                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                            {cumplidos}
                                        </span>
                                    </Col>
                                </div>
                            </Col>
                            <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                    <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#faad14', padding: 5, borderRadius: 10 }}>
                                        <i class="fas fa-exclamation-triangle fa-3x"></i>
                                    </span>
                                    <Col>
                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                            Pendientes
                                                </h5>
                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                            {pendientes}
                                        </span>
                                    </Col>
                                </div>
                            </Col>
                            <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                    <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#f5232e', padding: 5, borderRadius: 10 }}>
                                        <i class="fas fa-radiation-alt fa-3x"></i>
                                    </span>
                                    <Col>
                                        <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                            Incumplidos
                                        </h5>
                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                            {incumplidos}
                                        </span>
                                    </Col>
                                </div>
                            </Col>

                        </Row>
                        <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="btn btn-success float-right mt--6"
                            table="table-report"
                            filename="Reporte"
                            sheet="Reporte"
                            buttonText="Excel" />
                        <Table
                            style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn'
                            rowClassName='row_compromise'
                            dataSource={compromises}
                            columns={columns}
                            rowKey={record => record}
                            size="small"
                            scroll={{ y: 600 }}
                            pagination={false}
                            onRow={(record, rowIndex) => {
                                return {
                                    onClick: event => { record.student.user && dispatch(getStudentFullCompromise(record.student.user.id)) },
                                };
                            }} />
                    </Col>
                    <Col lg={3} md={3} style={{ paddingLeft: 50, paddingTop: 90 }}>
                        {isFetchingStudentFull ?
                            <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                                <div className='text-center'>
                                    <Loader
                                        type="BallTriangle"
                                        color="#5257f2"
                                        height={100}
                                        width={100}
                                    />
                                    <h1 className=' mt-3'>Cargando Informacion</h1>
                                    <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                                </div>
                            </div>
                            :
                            <>
                                {Object.keys(studentFull).length === 0 ?
                                    <>
                                        <div className='d-flex justify-content-center mt-7 animate__animated animate__fadeIn'>
                                            <img width='70%' alt="search" src={search_student} />
                                        </div>
                                        <div className='d-flex justify-content-center animate__animated animate__fadeIn'>
                                            <h3 className="d-flex justify-content-center text-center" style={{ fontSize: '15px', position: 'relative' }}>
                                                Haz clic en una fila para ver los datos<br />actuales del estudiante
                                            </h3>
                                        </div>
                                    </>
                                    :
                                    <div className="card_shadown animate__animated animate__fadeIn mt-5" style={{ borderRadius: 25, paddingTop: 20, paddingBottom: 30, paddingRight: 40, paddingLeft: 40, marginLeft: 10, marginRight: 20 }}>
                                        <h3 style={{ fontStyle: 40 }}>{studentFull.last_name} {studentFull.first_name}</h3>
                                        <SmallBarPayment student={studentFull.student} />
                                        <div className='card_shadown d-flex justify-content-center' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                            {renderIcons()}
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                    Meses en mora
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {studentFull.student.monthOwed}
                                                </span>
                                            </Col>
                                        </div>
                                        <div className='card_shadown d-flex justify-content-center mt-4' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                            {renderIcons()}
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                    Valor en Mora
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    $ {formatNumber(studentFull.student.amountOwed)}
                                                </span>
                                            </Col>
                                        </div>
                                        <div className='card_shadown d-flex justify-content-center mt-4' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                            <i class="fas fa-dollar-sign fa-2x icon_shadown d-flex align-items-center"
                                                style={{ backgroundColor: '#86bb02', color: '#ffffff', paddingTop: 8, paddingBottom: 8, paddingLeft: 11, paddingRight: 11, borderRadius: 10, margin: 5 }}>
                                            </i>
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                    Ultimo Pago
                                                </h5>
                                                {studentFull.student.payments.length === 0
                                                    ?
                                                    <p>No ah realizado ningun pago</p>
                                                    :
                                                    <>
                                                        <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                            $ {formatNumber(studentFull.student.payments[0].value)}
                                                        </span>
                                                        <Row>
                                                            <span className="font-weight-bold ml-2" style={{ fontSize: 13 }}>
                                                                {studentFull.student.payments[0].create}
                                                            </span>
                                                        </Row>
                                                    </>
                                                }
                                            </Col>
                                        </div>
                                    </div>
                                }
                            </>
                        }
                    </Col>
                </Row>
            }
        </>

    )
}

export default ListCompromises
