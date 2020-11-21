import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Container, Row, Col, FormGroup, Input, Spinner } from "reactstrap";
import { filterStudentsGrade } from '../../../redux/actions/studentActions'

export const NavbarGrades = () => {

    const grades = useSelector(state => state.gradeReducer.grades)
    const isFetching = useSelector(state => state.studentReducer.isFetching)
    const dispatch = useDispatch()

    const [state, setState] = useState({
        grade: 0,
        schedule: ''
    })

    const selectGrade = (e) => {
        const grade = JSON.parse(e.target.value)
        setState({
            ...state,
            grade: grade
        })

        if (state.schedule !== ''){
            dispatch(filterStudentsGrade(grade, state.schedule))
        }
    }

    const selectSchedule = (e) => {
        setState({
            ...state,
            schedule : parseInt(e.target.value)
        })
        dispatch(filterStudentsGrade(state.grade, parseInt(e.target.value)))
    }


    return (
        <>
            <div className="header bg-gradient-info pb-9  pt-md-4" >
                <Container >
                    <div className="header-body">
                        <Row className="d-flex justify-content-center">
                            <Col lg="6" xl="6">
                                <Card className="card-stats mt--5 mb-4">
                                    <CardBody>
                                        <Row>
                                            <h3 className="mb-0 font-varela ml-3" style={{ fontSize: '20px' }}>Selecciona un grado</h3>
                                            {isFetching && <Spinner className="float-right mb-1 ml-2" color="primary" />}
                                            <Col lg="8">
                                                <FormGroup className="mb--1">
                                                    <Input type="select" name="select" onChange={selectGrade} defaultValue="0" disabled={isFetching}>
                                                        <option disabled value="0">Seleccione un grado</option>
                                                        {grades.map(grade => (
                                                            <option value={JSON.stringify(grade)} key={grade.id} >{grade.name}</option>
                                                        ))}
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                            <Col lg="4">
                                                <FormGroup className="mb--1">
                                                    <Input type="select" name="schedule" onChange={selectSchedule} disabled={isFetching || state.grade === 0} defaultValue="0">
                                                        <option value='0' disabled>Seleccione una jornada...</option>
                                                        <option value={1}>Mañana</option>
                                                        <option value={2}>Tarde</option>
                                                        <option value={3}>Unica</option>
                                                    </Input>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default NavbarGrades;