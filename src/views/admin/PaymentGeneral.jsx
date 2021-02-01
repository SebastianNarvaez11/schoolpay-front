import React, { useState } from 'react'
import NavbarGeneralPayment from '../../components/Headers/admin/NavbarGeneralPayment'
import { useSelector } from 'react-redux'
import { Card, Container, Row, Col, Spinner, CardBody, CardTitle } from "reactstrap";
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
    Tooltip
} from '@devexpress/dx-react-chart-bootstrap4';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import { EventTracker, ValueScale, Animation, HoverState, SelectionState } from '@devexpress/dx-react-chart';
import { amountOfDebtors, totalOwed, formatNumber } from '../../helpers/functions'

export const PaymentGeneral = () => {

    const { grades } = useSelector(state => state.gradeReducer)
    const { isFetchingData, data_graphics } = useSelector(state => state.studentReducer)

    const [selected, setSelected] = useState('')
    const [selected2, setSelected2] = useState('')

    const compare = (
        { series, point }, { series: targetSeries, point: targetPoint },
    ) => series === targetSeries && point === targetPoint;

    const handleSelect = ({ targets }) => {
        const target = targets[0];
        if (target) {
            setSelected(selected[0] && compare(selected[0], target) ? [] : [target])
        }
    }

    const handleSelect1 = ({ targets }) => {
        const target = targets[0];
        if (target) {
            setSelected2(selected2[0] && compare(selected2[0], target) ? [] : [target])
        }
    }

    const getData = () => {
        const data = []
        grades.map(function (grade) {
            const item = { name: `${grade.name}`, value: grade.total_raised }
            return data.push(item)
        })
        return data
    }

    const getData2 = (schedule) => {
        const data = []
        grades.map(function (grade) {
            const item = { name: `${grade.name}`, value: amountOfDebtors(grade.id, schedule, data_graphics) }
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
        data.map(grado => {
            total = total + grado.value
        })
        return total
    }



    return (
        <>
            <NavbarGeneralPayment />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row className='d-flex justify-content-center'>
                    <Col lg={3} className='mb-3'>
                        <Card className="card-stats mb-xl-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle
                                            tag="h5"
                                            className="text-uppercase text-muted mb-0 font-varela"
                                        >
                                            Valor en Mora
                                                </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">
                                            $ {formatNumber(totalData(getData3(1)) + totalData(getData3(2)))}
                                        </span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="fas fa-chart-bar" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                    </Col>
                    <Col lg={3} className='mb-3'>
                        <Card className="card-stats mb-xl-0">
                            <CardBody>
                                <Row>
                                    <div className="col">
                                        <CardTitle
                                            tag="h5"
                                            className="text-uppercase text-muted mb-0 font-varela"
                                        >
                                            Estudiantes en Mora
                                                </CardTitle>
                                        <span className="h2 font-weight-bold mb-0">
                                             {formatNumber(totalData(getData2(1)) + totalData(getData2(2)))}
                                        </span>
                                    </div>
                                    <Col className="col-auto">
                                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                            <i className="fas fa-chart-bar" />
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>

                    </Col>
                    <Col lg={12} className="mb-4">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <Container fluid>
                                {isFetchingData
                                    ? <> <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" /> </>
                                    :
                                    <div>
                                        <Row>
                                            <Col lg={6}>
                                                <h3 className="font-varela " style={{ fontSize: 20, marginTop: 20 }}>
                                                    {selected.length ? getData3(1)[selected[0].point].name : undefined}<br />
                                                    {selected.length ? `$${formatNumber(getData3(1)[selected[0].point].value)}` : undefined}
                                                </h3>

                                            </Col>
                                            <Col lg={6}>
                                                <h3 className="font-varela float-right " style={{ fontSize: 20, marginTop: 20 }}>
                                                    Total: ${formatNumber(totalData(getData3(1)))}
                                                </h3>
                                            </Col>
                                        </Row>


                                        <Chart data={getData3(1)} >
                                            <ValueScale name="value" />
                                            <ArgumentAxis />
                                            <ValueAxis scaleName="value" />

                                            <BarSeries
                                                name="Units Sold"
                                                scaleName="value"
                                                valueField="value"
                                                argumentField="name"
                                                color="#faad14"
                                            />
                                            <Title
                                                text="Valores Adeudados - JORNADA MAÑANA"
                                            />
                                            <Animation />
                                            <EventTracker onClick={handleSelect} />
                                            <SelectionState selection={selected} />
                                        </Chart>
                                    </div>
                                }
                            </Container>
                        </Card>
                    </Col>
                    <Col lg={12} className="mb-4">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <Container fluid>
                                {isFetchingData
                                    ? <> <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" /> </>
                                    :

                                    <div>
                                        <Row>
                                            <Col lg={6}>
                                                <h3 className="font-varela " style={{ fontSize: 20, marginTop: 20 }}>
                                                    {selected2.length ? getData3(2)[selected2[0].point].name : undefined}<br />
                                                    {selected2.length ? `$${formatNumber(getData3(2)[selected2[0].point].value)}` : undefined}
                                                </h3>
                                            </Col>
                                            <Col lg={6}>
                                                <h3 className="font-varela float-right " style={{ fontSize: 20, marginTop: 20 }}>
                                                    Total: ${formatNumber(totalData(getData3(2)))}
                                                </h3>
                                            </Col>
                                        </Row>

                                        <Chart data={getData3(2)} >
                                            <ValueScale name="value" />
                                            <ArgumentAxis />
                                            <ValueAxis scaleName="value" />

                                            <BarSeries
                                                name="Units Sold"
                                                scaleName="value"
                                                valueField="value"
                                                argumentField="name"
                                                color="#ff6e40"
                                            />
                                            <Title
                                                text="Valores Adeudados - JORNADA TARDE"
                                            />
                                            <Animation />
                                            <EventTracker />
                                            <EventTracker onClick={handleSelect1} />
                                            <SelectionState selection={selected2} />
                                        </Chart>
                                    </div>
                                }
                            </Container>
                        </Card>
                    </Col>
                    <Col lg={12} className="mb-4">
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <Container fluid>
                                {isFetchingData
                                    ? <> <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" /> </>
                                    : <Chart data={getData()}>
                                        <ValueScale name="value" />
                                        <ArgumentAxis />
                                        <ValueAxis scaleName="value" />

                                        <BarSeries
                                            name="Units Sold"
                                            scaleName="value"
                                            valueField="value"
                                            argumentField="name"
                                        />
                                        <Title
                                            text="Ingresos Generados Por Grados"
                                        />
                                        <Animation />
                                        <EventTracker />
                                        <Tooltip />
                                        <HoverState />
                                    </Chart>
                                }
                            </Container>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <Container fluid>
                                {isFetchingData
                                    ? <> <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" /> </>
                                    : <Chart data={getData2(1)} rotated>
                                        <ValueScale name="value" />
                                        <ArgumentAxis />
                                        <ValueAxis scaleName="value" />

                                        <BarSeries
                                            name="Units Sold"
                                            scaleName="value"
                                            valueField="value"
                                            argumentField="name"
                                            color="#ff6e40"
                                        />
                                        <Title
                                            text="Cantidad De Deudores - JORNADA MAÑANA"
                                        />
                                        <Animation />
                                        <EventTracker />
                                        <Tooltip />
                                        <HoverState />
                                    </Chart>
                                }
                            </Container>
                        </Card>
                    </Col>
                    <Col lg={6}>
                        <Card id='card_shadow' className="animate__animated animate__fadeIn">
                            <Container fluid>
                                {isFetchingData
                                    ? <> <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" />
                                        <Spinner type="grow" color="primary" /> </>
                                    : <Chart data={getData2(2)} rotated>
                                        <ValueScale name="value" />
                                        <ArgumentAxis />
                                        <ValueAxis scaleName="value" />

                                        <BarSeries
                                            name="Units Sold"
                                            scaleName="value"
                                            valueField="value"
                                            argumentField="name"
                                            color="#ff6e40"
                                        />
                                        <Title
                                            text="Cantidad De Deudores - JORNADA TARDE"
                                        />
                                        <Animation />
                                        <EventTracker />
                                        <Tooltip />
                                        <HoverState />
                                    </Chart>
                                }
                            </Container>
                        </Card>
                    </Col>
                </Row>
            </Container >
        </>
    )
}

export default PaymentGeneral
