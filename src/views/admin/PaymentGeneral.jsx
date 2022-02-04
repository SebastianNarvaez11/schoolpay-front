import React, { useMemo } from 'react'
import NavbarGeneralPayment from '../../components/Headers/admin/NavbarGeneralPayment'
import { useSelector } from 'react-redux'
import { Container, Row, Col } from "reactstrap";
import { amountOfDebtors, totalOwed, formatNumber, enMora, alDia, unMes, dosMeses, tresMeses } from '../../helpers/functions'
import { Chart as ChartGoogle } from "react-google-charts";
import Loader from "react-loader-spinner";

export const PaymentGeneral = () => {

    const { grades } = useSelector(state => state.gradeReducer)
    const { isFetchingData, data_graphics, students } = useSelector(state => state.studentReducer)


    const en_mora = useMemo(() => enMora(data_graphics),
        //  eslint-disable-next-line
        [data_graphics])


    const al_dia = useMemo(() => alDia(data_graphics),
        //  eslint-disable-next-line
        [data_graphics])


    const un_mes = useMemo(() => unMes(data_graphics),
        //  eslint-disable-next-line
        [data_graphics])


    const dos_meses = useMemo(() => dosMeses(data_graphics),
        //  eslint-disable-next-line
        [data_graphics])


    const tres_meses = useMemo(() => tresMeses(data_graphics),
        //  eslint-disable-next-line
        [data_graphics])


    const cobertura = () => {
        if (data_graphics !== undefined) {
            if (students !== undefined) {
                return students.filter(data => data.student.coverage).length
            } else {
                return 0
            }
        } else {
            return 0
        }
    }


    const adeudadoPorJornada = (schedule) => {
        const data = [['Grados', 'En Mora']]
        grades.map(function (grade) {
            const item = [grade.abbreviation, totalOwed(grade.id, schedule, data_graphics)]
            return data.push(item)
        })
        return data
    }

    const ingresosGenereados = () => {
        const data = [['Grados', 'Ingresos']]
        grades.map(function (grade) {
            const item = [grade.abbreviation, grade.total_raised]
            return data.push(item)
        })
        return data
    }


    const deudoresPorJornada = (schedule) => {
        const data = [['Grados', 'Deudores']]
        grades.map(function (grade) {
            const item = [grade.abbreviation, amountOfDebtors(grade.id, schedule, data_graphics)]
            return data.push(item)
        })
        return data
    }

    const getData3 = (schedule) => {
        const data = []
        grades.map(function (grade) {
            const item = { name: `${grade.name}`, value: totalOwed(grade.id, schedule, data_graphics) }
            return data.push(item)
        })
        return data
    }

    const totalData = (data) => {
        let total = 0
        data.forEach(grado => {
            total = total + grado.value
        })
        return total
    }

    function diasEnUnMes() {
        const fecha = new Date()
        const mes = fecha.getMonth() + 1
        const año = fecha.getFullYear()
        return new Date(año, mes, 0).getDate() - fecha.getDate();
    }

    return (
        <>
            <NavbarGeneralPayment />
            <Container className=" pl-5 pr-5 pb-3" fluid>
                {isFetchingData ?
                    <div className='d-flex flex-column justify-content-center mt-9 animate__animated animate__fadeIn'>
                        <div className='text-center'>
                            <Loader
                                type="Grid"
                                color="#5257f2"
                                height={100}
                                width={100}
                            />
                            <h1 className=' mt-3'>Generando Estadisticas</h1>
                            <h3 style={{ fontStyle: 30 }}>Esto puede tardar un momento</h3>
                        </div>
                    </div>
                    :
                    <>
                        <Row className="mb-4">
                            <Col lg={9}>
                                <Row className='mb-5'>
                                    <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                        <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                            <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#2dce89', padding: 5, borderRadius: 10 }}>
                                                <i class="fas fa-check fa-3x"></i>
                                            </span>
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
                                    <Col lg={2} md={4} sm={6} className="d-flex justify-content-center ">
                                        <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                            <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#f5232e', padding: 5, borderRadius: 10 }}>
                                                <i class="fas fa-exclamation-circle fa-3x"></i>
                                            </span>
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                    En Mora
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {en_mora}
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
                                                    1 Mes
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {un_mes}
                                                </span>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={4} sm={6} className="d-flex justify-content-center ">
                                        <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                            <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#ff6f41', padding: 5, borderRadius: 10 }}>
                                                <i class="fas fa-exclamation-circle fa-3x"></i>
                                            </span>
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }} >
                                                    2 Meses
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {dos_meses}
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
                                                    3 ó Mas
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {tres_meses}
                                                </span>
                                            </Col>
                                        </div>
                                    </Col>
                                    <Col lg={2} md={4} sm={6} className="d-flex justify-content-center">
                                        <div className='card_shadown d-flex justify-content-center animate__animated animate__fadeIn' style={{ padding: 10, borderRadius: 10 }}>
                                            <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#11cdef', padding: 5, borderRadius: 10 }}>
                                                <i class="fas fa-certificate fa-3x"></i>
                                            </span>
                                            <Col>
                                                <h5 tag="h5" className="text-uppercase text-muted mb-0 " style={{ whiteSpace: 'nowrap' }}>
                                                    Cobertura
                                                </h5>
                                                <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                    {cobertura()}
                                                </span>
                                            </Col>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={6}>
                                        <div className="card_shadown animate__animated animate__fadeIn" style={{ height: 300, borderRadius: 25 }}>
                                            <Container fluid>
                                                <div style={{ padding: 5 }}>
                                                    <ChartGoogle
                                                        width={'110%'}
                                                        style={{ position: 'absolute', marginTop: -20, marginLeft: -20 }}
                                                        height={400}
                                                        chartType="PieChart"
                                                        loader={
                                                            <div className='d-flex flex-column justify-content-center mt-9'>
                                                                <div className='text-center'>
                                                                    <Loader
                                                                        type="Ball-Triangle"
                                                                        color="#5257f2"
                                                                        height={100}
                                                                        width={100}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        data={[
                                                            ['Task', 'Hours per Day'],
                                                            ['Al Dia', al_dia],
                                                            ['1 Mes', un_mes],
                                                            ['2 Meses', dos_meses],
                                                            ['3 Meses o mas', tres_meses],
                                                        ]}
                                                        options={{
                                                            // Just add this option
                                                            is3D: true,
                                                            backgroundColor: 'transparent',
                                                            slices: {
                                                                0: { color: '#2dce89' },
                                                                1: { color: '#faad14' },
                                                                2: { color: '#ff6f41' },
                                                                3: { color: '#f5232e' },
                                                            },
                                                        }}
                                                        rootProps={{ 'data-testid': '2' }}
                                                    />
                                                </div>
                                            </Container>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="card_shadown animate__animated animate__fadeIn" style={{ height: 300, borderRadius: 25 }}>
                                            <Container fluid>
                                                <div style={{ padding: 5 }}>
                                                    <ChartGoogle
                                                        width={'110%'}
                                                        style={{ position: 'absolute', marginTop: -20, marginLeft: -20 }}
                                                        height={400}
                                                        chartType="PieChart"
                                                        loader={
                                                            <div className='d-flex flex-column justify-content-center mt-9'>
                                                                <div className='text-center'>
                                                                    <Loader
                                                                        type="Ball-Triangle"
                                                                        color="#5257f2"
                                                                        height={100}
                                                                        width={100}
                                                                    />
                                                                </div>
                                                            </div>
                                                        }
                                                        data={[
                                                            ['Task', 'Hours per Day'],
                                                            ['Al Dia', al_dia],
                                                            ['Cobertura', cobertura()],
                                                            ['En Mora', en_mora],
                                                        ]}
                                                        options={{
                                                            // Just add this option
                                                            is3D: true,
                                                            backgroundColor: 'transparent',
                                                            slices: {
                                                                0: { color: '#2dce89' },
                                                                1: { color: '#11cdef' },
                                                                2: { color: '#f5242f' },

                                                            },
                                                        }}
                                                        rootProps={{ 'data-testid': '2' }}
                                                    />
                                                </div>
                                            </Container>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col lg={3}>
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, paddingTop: 20, paddingBottom: 30, paddingRight: 40, paddingLeft: 40, marginLeft: 50 }}>
                                    <div className='d-flex justify-content-center align-items-center mt--3'>
                                        <h1 style={{ fontSize: 80 }}>{diasEnUnMes()}</h1>
                                        <h1 style={{ fontSize: 20 }} className="ml-2">Dias para <br />finalizar el mes</h1>
                                    </div>
                                    <div className='card_shadown d-flex justify-content-center' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                        <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#86bb01', padding: 5, borderRadius: 10 }}>
                                            <i class="fas fa-money-bill-alt fa-3x"></i>
                                        </span>
                                        <Col>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                VALOR ADEUDADO
                                                </h5>
                                            <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                ${formatNumber(totalData(getData3(1)) + totalData(getData3(2)))}
                                            </span>
                                        </Col>
                                    </div>
                                    <div className='card_shadown d-flex justify-content-center mt-4' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                        <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#86bb01', padding: 5, borderRadius: 10 }}>
                                            <i class="fas fa-sun fa-3x"></i>
                                        </span>
                                        <Col>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                JORNADA MAÑANA
                                                </h5>
                                            <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                ${formatNumber(totalData(getData3(1)))}
                                            </span>
                                        </Col>
                                    </div>
                                    <div className='card_shadown d-flex justify-content-center mt-4' style={{ padding: 10, borderRadius: 10, backgroundColor: '#ffffff' }}>
                                        <span className='icon_shadown d-flex align-items-center' style={{ color: '#ffffff', backgroundColor: '#86bb01', padding: 5, borderRadius: 10 }}>
                                            <i class="fas fa-moon fa-3x"></i>
                                        </span>
                                        <Col>
                                            <h5 tag="h5" className="text-uppercase text-muted mb-0 " >
                                                JORNADA TARDE
                                                </h5>
                                            <span className="h2 font-weight-bold mb-0" style={{ fontSize: 20 }}>
                                                ${formatNumber(totalData(getData3(2)))}
                                            </span>
                                        </Col>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} className="mb-4">
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, backgroundColor: 'white', padding: 20 }}>
                                    <Container fluid>
                                        <ChartGoogle
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={
                                                <div className='d-flex flex-column justify-content-center mt-9'>
                                                    <div className='text-center'>
                                                        <Loader
                                                            type="Ball-Triangle"
                                                            color="#5257f2"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            data={adeudadoPorJornada(1)}
                                            options={{
                                                // Material design options
                                                colors: ['#5257f2'],
                                                legend: { position: 'none' },
                                                chart: {
                                                    title: 'Valores Adeudados',
                                                    subtitle: 'Jornada Mañana',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </Container>
                                </div>
                            </Col>
                            <Col lg={6} className="mb-4">
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, backgroundColor: 'white', padding: 20 }}>
                                    <Container fluid>
                                        <ChartGoogle
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={
                                                <div className='d-flex flex-column justify-content-center mt-9'>
                                                    <div className='text-center'>
                                                        <Loader
                                                            type="Ball-Triangle"
                                                            color="#5257f2"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            data={adeudadoPorJornada(2)}
                                            options={{
                                                // Material design options
                                                colors: ['#5257f2'],
                                                legend: { position: 'none' },
                                                chart: {
                                                    title: 'Valores Adeudados',
                                                    subtitle: 'Jornada Tarde',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </Container>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} className="mb-4">
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, backgroundColor: 'white', padding: 20 }}>
                                    <Container fluid>
                                        <ChartGoogle
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={
                                                <div className='d-flex flex-column justify-content-center mt-9'>
                                                    <div className='text-center'>
                                                        <Loader
                                                            type="Ball-Triangle"
                                                            color="#5257f2"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>

                                            }
                                            data={ingresosGenereados()}
                                            options={{
                                                // Material design options
                                                colors: ['#2ece89'],
                                                legend: { position: 'none' },
                                                chart: {
                                                    title: 'Ingresos Generados',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </Container>
                                </div>
                            </Col>
                            <Col lg={6} className="mb-4">
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, backgroundColor: 'white', padding: 20 }}>
                                    <Container fluid>
                                        <ChartGoogle
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={
                                                <div className='d-flex flex-column justify-content-center mt-9'>
                                                    <div className='text-center'>
                                                        <Loader
                                                            type="Ball-Triangle"
                                                            color="#5257f2"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            data={deudoresPorJornada(1)}
                                            options={{
                                                // Material design options
                                                colors: ['#f5242f'],
                                                legend: { position: 'none' },
                                                chart: {
                                                    title: 'N. De Deudores Por Grado',
                                                    subtitle: 'Jornada Mañana',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </Container>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={6} className="mb-4">
                                <div className="card_shadown animate__animated animate__fadeIn" style={{ borderRadius: 25, backgroundColor: 'white', padding: 20 }}>
                                    <Container fluid>
                                        <ChartGoogle
                                            width={'100%'}
                                            height={'300px'}
                                            chartType="Bar"
                                            loader={
                                                <div className='d-flex flex-column justify-content-center mt-9'>
                                                    <div className='text-center'>
                                                        <Loader
                                                            type="Ball-Triangle"
                                                            color="#5257f2"
                                                            height={100}
                                                            width={100}
                                                        />
                                                    </div>
                                                </div>
                                            }
                                            data={deudoresPorJornada(2)}
                                            options={{
                                                colors: ['#f5242f'],
                                                // Material design options
                                                legend: { position: 'none' },
                                                chart: {
                                                    title: 'N. De Deudores Por Grado',
                                                    subtitle: 'Jornada Tarde',
                                                },
                                            }}
                                            // For tests
                                            rootProps={{ 'data-testid': '2' }}
                                        />
                                    </Container>
                                </div>
                            </Col>
                        </Row>
                    </>
                }
            </Container >
        </>
    )
}

export default PaymentGeneral
