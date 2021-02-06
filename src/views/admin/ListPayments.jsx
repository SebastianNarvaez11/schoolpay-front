import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
//components
import HeaderAdmin from '../../components/Headers/admin/HeaderAdmin'
import { Table, Input as InputAntd, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Spinner } from "reactstrap";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import { fetchPayments } from '../../redux/actions/paymentActions'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'


const ListPayments = () => {

    const { payments, isFetchingPayments } = useSelector(state => state.paymentReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        if (payments.length === 0) {
            dispatch(fetchPayments())
        }

    }, [dispatch])


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
            render: (text, row) => `${row.value}`,
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
            <HeaderAdmin />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row>
                    <div className="col">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <CardHeader className="border-0">
                                <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Pagos</h3>
                                <ReactHTMLTableToExcel
                                    id="test-table-xls-button"
                                    className="btn btn-success float-right  mt--5"
                                    table="table-report"
                                    filename="Reporte"
                                    sheet="Reporte"
                                    buttonText="Reporte Excel" />
                            </CardHeader>
                            {isFetchingPayments ?
                                <div style={{ margin: 40, alignSelf: 'center' }}>
                                    <Spinner className="float-right" color="primary" />
                                </div>
                                :
                                <Container fluid>
                                    <Table className='table-responsive'
                                        dataSource={payments}
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

export default ListPayments
