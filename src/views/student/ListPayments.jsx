import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../../redux/actions/authActions'
import queryString from 'query-string';
import { formatNumber } from '../../helpers/functions'
//components
import { BarPayment } from '../../components/Payment/BarPayment'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Card, CardHeader, Container, Row, Button } from "reactstrap";
import ModalPayment from '../../components/Student/ModalPayment'
import Highlighter from 'react-highlight-words';
import { ToastConfirmPay, ToastErrorPay, ToastPendingPay } from '../../assets/alerts'
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";


const ListPayments = () => {

    const dispatch = useDispatch()

    const current_user = useSelector(state => state.authReducer.current_user)
    const total_restante = current_user.student.total_year - current_user.student.total_paid
    let url = window.location.search
    let params = queryString.parse(url)

    //para cuando se monnta por primer vez
    useEffect(() => {
        dispatch(getCurrentUser())
    }, [dispatch])

    // para cuando cambia la url con parametros
    useEffect(() => {
        alertInfo()
        // eslint-disable-next-line
    }, [])

    //modal
    const [useShow, setShow] = useState({
        show: false,
        referenceCode: ''
    })


    const alertInfo = () => {
        console.log(params)
        if (params.transactionState === '4') {
            ToastConfirmPay('¡Genial! Tu pago se realizo con exito').fire()
        }

        else if (params.transactionState === '6') {
            ToastErrorPay('Lo Sentimos... Tu pago no puedo ser procesado con exito').fire()
        }

        else if (params.transactionState === '7') {
            ToastPendingPay('¡Ok! Tu pago esta pendiente, una vez realices el pago, podras verlo registrado en la plataforma').fire()
        }
    }


    const generateCode = (length) => {
        var result = '';
        var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }


    const toggleModal = () => {
        setShow({
            show: !useShow.show,
            referenceCode: generateCode(10)
        })
    }



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
            title: 'Referencia',
            dataIndex: ['reference'],
            ...getColumnSearchProps("reference"),
            render: (text, row) => `${row.reference} `,
        },
        {
            title: 'Concepto',
            dataIndex: ['description'],
            ...getColumnSearchProps("description"),
            render: (text, row) => `${row.description} `,
        },
        {
            title: 'Valor',
            dataIndex: 'value',
            ...getColumnSearchProps("value"),
            render: (text, row) => `$ ${formatNumber(row.value)}`,
        },
        {
            title: 'Fecha de Pago',
            dataIndex: 'create',
            ...getColumnSearchProps("create"),
            render: (text, row) => `${row.create}`,
        },
    ];


    return (
        <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
            <Row>
                <div className="col">
                    <Card id='card_shadow'>
                        <CardHeader className="border-0">
                            <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Pagos</h3>
                            {(total_restante > 0) ? <Button className='btn btn-outline-success float-right  mt--5' color="success" type="button" onClick={() => toggleModal()}>
                                Realizar un Nuevo Pago <i className="fas fa-plus ml-1"></i>
                            </Button> : <p>Genial! ya esta a paz y salvo</p>}
                        </CardHeader>
                        <Container fluid>
                            <div >
                                <BarPayment student={current_user.student} />
                            </div>
                            <Table className='table-responsive'
                                dataSource={current_user.student.payments}
                                columns={columns}
                                rowKey="id"
                                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '20', '30'] }} />
                        </Container>
                    </Card>
                </div>
            </Row>
            {useShow.show && <ModalPayment show={useShow.show} referenceCode={useShow.referenceCode} toggle={() => toggleModal()} />}
        </Container >
    )
}

export default ListPayments
