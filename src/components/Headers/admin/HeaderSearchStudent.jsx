import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { filterStudents, getStudentFull} from '../../../redux/actions/studentActions'
import {ModalCreateStudent} from '../../Admin/ModalCreateStudent'
// reactstrap components
import { Card, CardBody, Container, Row, Col, Input, Spinner, Button } from "reactstrap";

export const HeaderSearchStudent = () => {

  const { students_filter, student_select, isFetching } = useSelector(state => state.studentReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    if(student_select.student !== undefined){
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
      <div className="header bg-gradient-info pb-9  pt-md-4" >
        <Container >
          <div className="header-body">
            <Row className="d-flex justify-content-center">
              <Col lg="6" xl="6">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col ">
                        {isFetching && <Spinner className="float-right" color="primary" />}
                        <h3 className="mb-0 font-varela" style={{ fontSize: '25px' }}>Estudiantes</h3>

                        <Input className="form-control" onChange={onfilterStudents} list="hosting-plan" type="text" placeholder="Digite el codigo o nombre del estudiante..." disabled={isFetching}/>
                        <datalist id="hosting-plan">
                          {students_filter.slice(0, 4).map(user => (
                            <option key={user.id}>{user.student.code + ' ' + user.last_name + ' ' + user.first_name}</option>
                          ))}
                        </datalist>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            
          </div>
        </Container>
        <Button color="success" className='ml-5' onClick={toggleCreate}><i className="fas fa-user-plus"></i> <br/>Crear Estudiante</Button>
      </div>
      <ModalCreateStudent show={showCreate} toggle={toggleCreate} />
    </>
  )
}

export default HeaderSearchStudent;