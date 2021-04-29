import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getCurrentUser } from '../../redux/actions/authActions'
import queryString from 'query-string';
import { formatNumber, scheduleFormat, initialCharge } from '../../helpers/functions'
//components
import { BarPayment } from '../../components/Payment/BarPayment'
import { Table, Input, Button as ButtonAntd } from 'antd';
import { Row, Button, Col } from "reactstrap";
import ModalPayment from '../../components/Student/ModalPayment'
import Highlighter from 'react-highlight-words';
import { ToastConfirmPay, ToastErrorPay, ToastPendingPay } from '../../assets/alerts'
import { SearchOutlined } from '@ant-design/icons';
import get from "lodash.get";
import isequal from "lodash.isequal";
import invoice_img from '../../assets/img/Invoice-rafiki.png'


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

    const renderIcons = () => {
        const n = current_user.student.monthOwed
        const e = current_user.student.amountOwed

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
            <Row style={{ paddingLeft: 50, paddingRight: 50 }}>
                <Col lg={8} md={8}>
                    <div className="animate__animated animate__fadeIn mb-3">
                        <h3 className="mb-0 " style={{ fontSize: '30px' }}>
                            <div className='d-flex justify-content-start'>
                                {current_user.last_name + " " + current_user.first_name}
                            </div>
                        </h3>
                        <Row className='d-flex justify-content-between mb-3' style={{ paddingLeft: 12, paddingRight: 12 }}>
                            <h5 tag="h5" className="text-uppercase text-muted mb-0 float-right" style={{ fontSize: '20px' }}>{current_user.student.grade.name}
                                <br />
                                {scheduleFormat(current_user.student.schedule)}
                            </h5>
                            <h3 style={{ fontSize: '30px' }}>{current_user.student.code}</h3>
                        </Row>
                    </div>
                    <Row>
                        <Col lg={12} className='d-flex justify-content-end mb-3'>
                            {(total_restante > 0)
                                ?
                                <Button className='btn btn-success float-right' color="success" type="button" onClick={() => toggleModal()}>
                                    <i className="fas fa-plus mr-2"></i>Pagar
                                </Button>
                                :
                                <p>Genial! ya esta a paz y salvo</p>
                            }
                        </Col>
                    </Row>
                    <BarPayment student={current_user.student} />
                    <Row className='mt-4 mb-4 d-flex justify-content-center'>
                        <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                            <div className=' animate__animated animate__fadeIn text-center' style={{ padding: 10, borderRadius: 20, backgroundColor: 'white' }}>
                                {renderIcons()}
                                <Col>
                                    <h5 tag="h5" className="text-uppercase text-muted mb-1 mt-2 " style={{ whiteSpace: 'nowrap' }}>
                                        N. Meses en<br />Mora
                                    </h5>
                                    <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                        {current_user.student.monthOwed}
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
                                        $ {formatNumber(current_user.student.amountOwed)}
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
                                        $ {formatNumber(current_user.student.total_paid - ((Math.floor(current_user.student.total_paid / current_user.student.monthly_payment) * current_user.student.monthly_payment)))}
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
                                        {initialCharge(current_user.student.initial_charge)}
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
                                        $ {formatNumber(current_user.student.monthly_payment)}
                                    </span>
                                </Col>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <h3 className="mb-0 " style={{ fontSize: '20px' }}>Pagos Realizados</h3>
                        <Table style={{ width: '100%' }}
                            className='animate__animated animate__fadeIn'
                            dataSource={current_user.student.payments}
                            columns={columns}
                            rowKey="id"
                            scroll={{ y: 400 }}
                            pagination={false} />
                    </Row>
                </Col>
                <Col lg={4}>
                    {current_user.student.compromises.filter(compromise => compromise.state === 1).length !== 0 &&
                        <div className='animate__animated animate__fadeIn mt-3' style={{ padding: 20, borderRadius: 20, backgroundColor: '#fff2b2', marginLeft: 50 }}>
                            <h3 style={{ fontSize: '20px', color: '#faad1b' }}>
                                Compromiso Pendiente
                            </h3>
                            <h3 style={{ fontSize: '15px', color: '#faad1b' }}>
                                Fecha Pactada: {current_user.student.compromises.filter(compromise => compromise.state === 1)[0].date_pay}
                            </h3>
                            <h3 style={{ fontSize: '15px', color: '#faad1b' }}>
                                Mensualidades: {current_user.student.compromises.filter(compromise => compromise.state === 1)[0].month_owed}
                            </h3>
                            <h3 style={{ fontSize: '15px', color: '#faad1b' }}>
                                Valor: $ {formatNumber(current_user.student.compromises.filter(compromise => compromise.state === 1)[0].value)}
                            </h3>
                        </div>
                    }
                    <div className='d-flex justify-content-center mt-9 animate__animated animate__fadeIn'>
                        <img width='80%' alt="search" src={invoice_img} />
                    </div>
                </Col>
            </Row>
            {useShow.show && <ModalPayment show={useShow.show} referenceCode={useShow.referenceCode} toggle={() => toggleModal()} />}
        </>
    )
}

export default ListPayments
