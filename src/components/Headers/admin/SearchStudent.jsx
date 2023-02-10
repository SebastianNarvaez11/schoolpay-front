import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { filterStudents, getStudentFull } from '../../../redux/actions/studentActions'
import { ModalCreateStudent } from '../../Admin/ModalCreateStudent'
import { Row, Col, Input,  Button, FormGroup, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import Loader from "react-loader-spinner";

export const SearchStudent = () => {

  const { student_select, isFetching, students_filter, isFetchingStudent } = useSelector(state => state.studentReducer)
  const { current_user } = useSelector(state => state.authReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    if (student_select.student !== undefined) {
      dispatch(getStudentFull(student_select.id))
    }
    // eslint-disable-next-line
  }, [dispatch, student_select.student])


  const onfilterStudents = (e) => {
    dispatch(filterStudents(e.target.value))
  }


  // modal de creacion de estudante
  const [showCreate, setSchowCreate] = useState(false)

  const toggleCreate = () => setSchowCreate(!showCreate)


  return (
    <>
      <Row className='ml-5'>
        <Col lg={3} md={3}>
          <FormGroup className='d-flex justify-content-between'>
            <InputGroup id='input-group-login' className="input-group-alternative mb-4">
              <Input className="input_search" style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: 'transparent', paddingLeft: 30, width: '50%' }} onChange={onfilterStudents}
                list="hosting-plan" type="text"
                placeholder="Codigo o Nombre del estudiante"
                disabled={isFetching} />
              <datalist id="hosting-plan" >
                {students_filter.slice(0, 5).map(user => (
                  <option key={user.id}>{user.student.code + ' ' + user.last_name + ' ' + user.first_name}</option>
                ))}
              </datalist>
              <InputGroupAddon addonType="prepend">
                <InputGroupText style={{ borderTopRightRadius: 20, borderBottomRightRadius: 20, backgroundColor: 'transparent' }}>
                  <i className="fas fa-search" style={{ color: '#5257f2', paddingRight: 10 }}></i>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
            {isFetchingStudent &&
              <div className='animate__animated animate__fadeIn ml-5 mt--3'>
                <div className='text-center'>
                  <Loader
                    type="BallTriangle"
                    color="#5257f2"
                    height={60}
                    width={60}
                  />
                </div>
              </div>
            }
          </FormGroup>
        </Col>
        <Col lg={8} md={8}>
          {current_user.type === 1 &&
            <>
              <Button style={{ backgroundColor: '#5257f2', marginLeft: '40%' }} onClick={toggleCreate}><i className="fas fa-plus mr-2"></i>Añadir Estudiante</Button>
              <ModalCreateStudent show={showCreate} toggle={toggleCreate} />
            </>
          }
        </Col>
      </Row>
    </>
  )
}

export default SearchStudent;