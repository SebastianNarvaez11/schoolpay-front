import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import HeaderReports from '../../components/Headers/admin/HeaderReports'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Spinner } from "reactstrap";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { formatNumber } from '../../helpers/functions'

export const Reports = () => {

    const { data_graphics, isFetchingData } = useSelector(state => state.studentReducer)

    useEffect(() => {
        if (data_graphics.length !== 0) {
            const table = window.document.querySelectorAll('table');
            table[1].setAttribute('id', 'table-report');
        }

    }, [data_graphics.length])

    //Logica para la datatable
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')

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
            render: (text, row) => `${row.student.code} `,
        },
        {
            title: 'Apellidos',
            dataIndex: 'last_name',
            ...getColumnSearchProps("last_name"),
            render: (text, row) => `${row.last_name}`,
        },
        {
            title: 'Nombres',
            dataIndex: ['first_name'],
            ...getColumnSearchProps("first_name"),
            render: (text, row) => `${row.first_name} `,
        },
        {
            title: 'Cobertura',
            dataIndex: ['student', 'coverage'],
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
            title: 'Grado',
            dataIndex: ['student', 'grade', 'name'],
            ...getColumnSearchProps("student.grade.name"),
            sorter: (a, b) => { return a.student.grade.name.localeCompare(b.student.grade.name) },
            sortDirections: ['ascend', 'descend'],
            render: (text, row) => `${row.student.grade.name}`,
        },
        {
            title: 'Jornada',
            dataIndex: ['student', 'schedule'],
            filters: [
                {
                    text: 'Mañana',
                    value: '1',
                },
                {
                    text: 'Tarde',
                    value: '2',
                },
                {
                    text: 'Unica',
                    value: '3',
                },
            ],
            filterMultiple: false,
            onFilter: (value, record) => String(record.student.schedule).indexOf(value) === 0,
            render: (text, row) => {
                if (row.student.schedule === 1) {
                    return 'Mañana'
                }
                if (row.student.schedule === 2) {
                    return 'Tarde'
                }
                else {
                    return 'Unica'
                }
            }
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
    ];


    return (
        <>
            <HeaderReports />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row>
                    <div className="col">
                        <Card id='card_shadow'>
                            <CardHeader className="border-0">
                                <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Estudiantes</h3>

                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="btn btn-success float-right  mt--5"
                                    table="table-report"
                                    filename="Reporte"
                                    sheet="Reporte"
                                    buttonText="Reporte Excel" />

                            </CardHeader>
                            <Container fluid>
                                {isFetchingData
                                    ?
                                    <Spinner className="d-flex justify-content-center mb-5" color="primary" style={{ width: '3rem', height: '3rem', margin: 'auto' }} />
                                    :
                                    <Table className='table-responsive'
                                        dataSource={data_graphics}
                                        columns={columns}
                                        rowKey="id"
                                        size="small"
                                        scroll={{ x: 'calc(700px + 50%)', y: 500 }}
                                        pagination={false}
                                        />
                                }
                            </Container>
                        </Card>
                    </div>
                </Row>
            </Container >
        </>
    )
}

export default Reports
