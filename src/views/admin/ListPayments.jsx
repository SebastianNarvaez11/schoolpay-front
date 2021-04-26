import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
//components
import { Table, Input as InputAntd, Button as ButtonAntd } from 'antd';
import {  Row, Col } from "reactstrap";
import SelectPeriodPayment from '../../components/Headers/admin/SelectPeriodPayment'
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import Loader from "react-loader-spinner";
import { formatNumber } from '../../helpers/functions'


const ListPayments = () => {

    const { payments, isFetchingPayments, isFetchingPaymentsByPeriod } = useSelector(state => state.paymentReducer)

    const valorRecaudado = () => {
        let total = 0
        payments.forEach(payment => {
            total = total + payment.value
        })
        return total
    }

    useEffect(() => {
        if (payments.length !== 0) {
            const table = window.document.querySelectorAll('table');
            table[1].setAttribute('id', 'table-report');
        }

    }, [payments.length])

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
            dataIndex: ['student', 'user', 'last_name'],
            render: (text, row) => `${row.student.user.last_name} ${row.student.user.first_name} `,
        },
        {
            title: 'Grado',
            dataIndex: ['student', 'grade', 'name'],
            render: (text, row) => `${row.student.grade.name}`,
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            ...getColumnSearchProps("value"),
            render: (text, row) => `$ ${formatNumber(row.value)}`,
        },
        {
            title: 'Fecha',
            dataIndex: 'create',
            ...getColumnSearchProps("create"),
            render: (text, row) => `${row.create}`,
        },
        {
            title: 'Descripcion',
            dataIndex: 'description',
            ...getColumnSearchProps("description"),
            render: (text, row) => `${row.description}`,
        },
        {
            title: 'Referencia',
            dataIndex: 'reference',
            ...getColumnSearchProps("reference"),
            render: (text, row) => `${row.reference}`,
        },
    ];


    return (
        <>
            {isFetchingPayments
                ?
                <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                    <div className='text-center'>
                        <Loader
                            type="BallTriangle"
                            color="#5257f2"
                            height={100}
                            width={100}
                        />
                        <h1 className=' mt-3'>Cargando Pagos</h1>
                        <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                    </div>
                </div>
                :
                <>
                    <Row>
                        <SelectPeriodPayment />
                    </Row>
                    {isFetchingPaymentsByPeriod
                        ?
                        <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                            <div className='text-center'>
                                <Loader
                                    type="BallTriangle"
                                    color="#5257f2"
                                    height={100}
                                    width={100}
                                />
                                <h1 className=' mt-3'>Cargando Pagos</h1>
                                <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                            </div>
                        </div>
                        :
                        <>
                            <Row className='mb-4' style={{ paddingLeft: 50, paddingRight: 50 }}>

                                <Col lg={2} md={4} sm={6} >
                                    <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                        <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#2dce89', padding: 5, borderRadius: 10 }}>
                                            <i class="fas fa-check fa-3x"></i>
                                        </span>
                                        <Col>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                Total Realizados
                                                </h5>
                                            <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                {payments.length}
                                            </span>
                                        </Col>
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={6} >
                                    <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                        <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#2dce89', padding: 5, borderRadius: 10 }}>
                                            <i class="fas fa-donate fa-3x"></i>
                                        </span>
                                        <Col>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                Total Recaudado
                                                </h5>
                                            <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                $ {formatNumber(valorRecaudado())}
                                            </span>
                                        </Col>
                                    </div>
                                </Col>
                                <Col lg={8} md={8} sm={6} >
                                    <ReactHTMLTableToExcel
                                        id="test-table-xls-button"
                                        className="btn btn-success float-right"
                                        table="table-report"
                                        filename="Reporte"
                                        sheet="Reporte"
                                        buttonText="Reporte Excel" />
                                </Col>

                            </Row>
                            <Row style={{ paddingLeft: 50, paddingRight: 50 }}>

                                <Table style={{ width: '100%' }}
                                    className='animate__animated animate__fadeIn'
                                    dataSource={payments}
                                    columns={columns}
                                    rowKey="id"
                                    size="small"
                                    scroll={{ y: 500 }}
                                    pagination={false} />
                            </Row>
                        </>
                    }
                </>
            }
        </>
    )
}

export default ListPayments
