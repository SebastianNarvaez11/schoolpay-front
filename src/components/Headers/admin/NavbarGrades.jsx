import React, { useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import {  Row, FormGroup, Input, InputGroup } from "reactstrap";
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

        if (state.schedule !== '') {
            dispatch(filterStudentsGrade(grade, state.schedule))
        }
    }

    const selectSchedule = (e) => {
        setState({
            ...state,
            schedule: parseInt(e.target.value)
        })
        dispatch(filterStudentsGrade(state.grade, parseInt(e.target.value)))
    }


    return (
        <Row>
            <FormGroup className=" animate__animated animate__fadeIn ml-5">
                <InputGroup id='input-group-login' className="input-group-alternative">
                    <Input
                        className="input_search" style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: 'transparent', paddingLeft: 30, width: 400 }}
                        type="select" name="select" onChange={selectGrade} defaultValue="0" disabled={isFetching}>
                        <option disabled value="0">Seleccione un grado</option>
                        {grades.map(grade => (
                            <option value={JSON.stringify(grade)} key={grade.id} >{grade.name}</option>
                        ))}
                    </Input>
                </InputGroup>
            </FormGroup>
            <FormGroup className="animate__animated animate__fadeIn ml-5">
                <InputGroup id='input-group-login' className="input-group-alternative">
                    <Input
                        className="input_search" style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: 'transparent', paddingLeft: 30, width: 400 }}
                        type="select" name="schedule" onChange={selectSchedule} disabled={isFetching || state.grade === 0} defaultValue="0">
                        <option value='0' disabled>Seleccione una jornada</option>
                        <option value={1}>Mañana</option>
                        <option value={2}>Tarde</option>
                        <option value={3}>Unica</option>
                    </Input>
                </InputGroup>
            </FormGroup>
        </Row>
    )
}

export default NavbarGrades;