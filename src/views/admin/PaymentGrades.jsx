import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import NavbarGrades from '../../components/Headers/admin/NavbarGrades'
import { SmallBarPayment } from '../../components/Payment/SmallBarPayment'
import { ModalSpinner } from '../../components/Spinner/ModalSpinner'
import { ModalConfirmPhone } from '../../components/Admin/ModalConfirmPhone'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Spinner, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { ToastConfirmSendSms } from '../../assets/alerts'
import { resetStudentSelect } from '../../redux/actions/studentActions'
import { sendEmailMassive } from '../../redux/actions/contactAction'
import { formatNumber, scheduleFormat } from '../../helpers/functions'
import { sms_recordatorio, email_recordatorio, wpp_recordatorio, wpp_recordatorio2 } from '../../helpers/messages'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";

export const PaymentGrades = () => {

    const { isFetching, schedule_select, students_filter } = useSelector(state => state.studentReducer)
    const { sending } = useSelector(state => state.contactReducer)
    const grade_select = useSelector(state => state.gradeReducer.grade_select)
    const dispatch = useDispatch()

    //efecto para limpiar el studen_select y el students_filter
    useEffect(() => {
        return () => {
            console.log('desmontado')
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
            width: 350,
            ...getColumnSearchProps("last_name"),
            sorter: (a, b) => { return a.last_name.localeCompare(b.last_name) },
            sortDirections: ['ascend', 'descend'],
            render: (text, row) => `${row.last_name} ${row.first_name}`,
        },
        {
            title: 'Covertura',
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
            width: 500,
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
            title: 'Wpp',
            dataIndex: 'id',
            width: 50,
            render: (text, row) => {
                return (
                    <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                        <DropdownToggle style={{padding: '0px', paddingLeft: '5px',paddingRight: '5px'}}>
                            <span style={{ fontSize: '20px', color: '#00e676' }}>
                                <i id='icon-button' className="fab fa-whatsapp"></i>
                            </span>
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem disabled>{row.student.phone1}</DropdownItem>
                            <DropdownItem onClick={() => senWppSms(wpp_recordatorio(row), row.student.phone1)}>
                                Mensaje de Recordatorio
                            </DropdownItem>
                            <DropdownItem onClick={() => senWppSms(wpp_recordatorio2(row), row.student.phone1)}>
                                Mensaje de Recordatorio 2
                            </DropdownItem>
                            <DropdownItem onClick={() => senWppSms(sms_recordatorio(row), row.student.phone1)}>
                                Mensaje de Cobro
                            </DropdownItem>
                            <DropdownItem disabled>{row.student.phone2}</DropdownItem>
                            <DropdownItem onClick={() => senWppSms(wpp_recordatorio(row), row.student.phone2)}>
                                Mensaje de Recordatorio
                            </DropdownItem>
                            <DropdownItem onClick={() => senWppSms(wpp_recordatorio2(row), row.student.phone2)}>
                                Mensaje de Recordatorio 2
                            </DropdownItem>
                            <DropdownItem onClick={() => senWppSms(sms_recordatorio(row), row.student.phone2)}>
                                Mensaje de Cobro
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                );
            },
        },
    ];


    return (
        <>
            <NavbarGrades />
            <Container className="mt--9 pl-5 pr-5 pb-3" fluid>
                {Object.keys(grade_select).length === 0
                    ? <h3 className="d-flex justify-content-center mb-0 mt-5 font-varela" style={{ fontSize: '25px', position: 'relative' }}>Seleccione un grado... </h3>
                    : <Row>
                        <div className="col">
                            <Card id='card_shadow' className="animate__animated animate__fadeIn">
                                <CardHeader className="border-0"> <div className="float-right mt--2">
                                    <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                        <DropdownToggle disabled={selectedRow.length === 0}>
                                            <span style={{ color: '#ffe000' }}>
                                                <i id='icon-button' className="fas fa-sms fa-3x"></i>
                                            </span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem
                                                onClick={() => toggleCreateSms(sms_recordatorio)}>
                                                Recordatorio de Meses en mora
                                                </DropdownItem>
                                            <DropdownItem disabled>Action</DropdownItem>
                                            <DropdownItem
                                                onClick={console.log()}>
                                                Circular de Cobro
                                                </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                    <UncontrolledDropdown direction="left" className="mt-1 mb-1">
                                        <DropdownToggle disabled={selectedRow.length === 0}>
                                            <span style={{ color: '#f14336' }}>
                                                <i id='icon-button' className="far fa-envelope fa-3x"></i>
                                            </span>
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem
                                                onClick={() => sentEmails(email_recordatorio)}>
                                                Recordatorio de Meses en mora
                                                </DropdownItem>
                                            <DropdownItem disabled>Action</DropdownItem>
                                            <DropdownItem
                                                onClick={console.log()}>
                                                Circular de Cobro
                                                </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>

                                </div>
                                    <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>{grade_select.name} - {scheduleFormat(schedule_select)}</h3>

                                </CardHeader>
                                <Container fluid>
                                    {isFetching
                                        ?
                                        <Spinner className="d-flex justify-content-center mb-5" color="primary" style={{ width: '3rem', height: '3rem', margin: 'auto' }} />
                                        :
                                        <>
                                            <Table className='table-responsive'
                                                dataSource={students_filter}
                                                rowSelection={rowSelection}
                                                columns={columns}
                                                rowKey={record => record}
                                                size="small"
                                                scroll={{ x: 'calc(700px + 50%)', y: 500 }}
                                                pagination={false} />
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela">Mensualidad: $ {formatNumber(grade_select.monthly_pay)}</h5>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 font-varela">Matricula: $ {formatNumber(grade_select.enrollment)}</h5>
                                        </>
                                    }
                                </Container>
                            </Card>
                        </div>
                    </Row>
                }
                <ModalSpinner isLoading={sending} text={'Enviando ...'}/>
                <ModalConfirmPhone show={modalSms.show} selectedRow={selectedRow} msg={modalSms.message} toggle={toggleCreateSms} />
            </Container >
        </>
    )
}

export default PaymentGrades
