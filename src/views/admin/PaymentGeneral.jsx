import React from 'react'
import NavbarGeneralPayment from '../../components/Headers/admin/NavbarGeneralPayment'
import { useSelector } from 'react-redux'
import { Card, Container, Row, Col, Spinner } from "reactstrap";
import {
    Chart,
    BarSeries,
    Title,
    ArgumentAxis,
    ValueAxis,
    Tooltip,
} from '@devexpress/dx-react-chart-bootstrap4';
import '@devexpress/dx-react-chart-bootstrap4/dist/dx-react-chart-bootstrap4.css';
import { EventTracker, ValueScale, Animation, HoverState } from '@devexpress/dx-react-chart';
import { amountOfDebtors } from '../../helpers/functions'

export const PaymentGeneral = () => {

    const { grades } = useSelector(state => state.gradeReducer)
    const { isFetchingData, data_graphics } = useSelector(state => state.studentReducer)

    const getData = () => {
        const data = []
        grades.map(function (grade) {
            const item = { name: `${grade.name}`, value: grade.total_raised }
            return data.push(item)
        })
        console.log(data)
        return data
    }

    const getData2 = (schedule) => {
        const data = []
        grades.map(function (grade) {
            const item = { name: `${grade.name}`, value: amountOfDebtors(grade.id, schedule, data_graphics) }
            return data.push(item)
        })
        console.log(data)
        return data
    }


    return (
        <>
            <NavbarGeneralPayment />
            <Container className="mt--8 pl-5 pr-5 pb-3" fluid>
                <Row>
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
                                            text="Ganancias Genereadas Por Grados"
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
