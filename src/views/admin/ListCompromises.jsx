import React, { useState } from 'react'
import { useSelector } from 'react-redux'
//components
import HeaderAdmin from '../../components/Headers/admin/HeaderAdmin'
import { Table, Input as InputAntd, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Col, Spinner } from "reactstrap";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { formatNumber } from '../../helpers/functions'


const ListCompromises = () => {

    const { compromises, isFetchingCompromises } = useSelector(state => state.paymentReducer)



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
            dataIndex: ['student', 'gtade', 'name'],
            render: (text, row) => `${row.student.grade.name}`,
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            ...getColumnSearchProps("value"),
            render: (text, row) => `$ ${formatNumber(row.value)}`,
        },
        {
            title: 'Mensualidades a Pagar',
            dataIndex: 'month_owed',
            ...getColumnSearchProps("month_owed"),
            render: (text, row) => `${row.month_owed}`,
        },
        {
            title: 'Fecha Creacion',
            dataIndex: 'create',
            ...getColumnSearchProps("create"),
            render: (text, row) => `${row.create}`,
        },
        {
            title: 'Fecha Estupilada',
            dataIndex: 'date_pay',
            ...getColumnSearchProps("date_pay"),
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
                            <span style={{ fontSize: '20px', color: '#f5222d' }} >
                                <i id='icon-button' className="far fa-trash-alt"></i>
                            </span>
                        </Col>
                    </Row>
                );
            },
        },
    ];


    return (
        <>
            <HeaderAdmin />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row>
                    <div className="col">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <CardHeader className="border-0">
                                <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Compromisos de Pago</h3>

                            </CardHeader>
                            {isFetchingCompromises ?
                                <div style={{ margin: 40, alignSelf: 'center' }}>
                                    <Spinner className="float-right" color="primary" />
                                </div>
                                :
                                <Container fluid>
                                    <Table className='table-responsive'
                                        dataSource={compromises}
                                        columns={columns}
                                        rowKey="id"
                                        size="small"
                                        scroll={{ x: 'calc(700px + 50%)', y: 500 }}
                                        pagination={false} />
                                </Container>
                            }
                        </Card>
                    </div>
                </Row>
            </Container >
        </>

    )
}

export default ListCompromises
