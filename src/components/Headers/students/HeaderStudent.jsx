import React from "react";
import { useSelector } from 'react-redux'
import { formatNumber } from '../../../helpers/functions'

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const HeaderStudent = () => {

  const { current_user } = useSelector(state => state.authReducer)

  return (
    <>
      <div className="header bg-blue pb-9  pt-md-4" >
        <Container >
          <div className="header-body">
            <Row className='d-flex justify-content-center'>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0 font-varela"
                        >
                          {current_user.first_name} {current_user.last_name}
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          Codigo: {current_user.student.code}
                        </span>
                      </div>
                    </Row>
                    <p className=" mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        {current_user.student.grade.name}
                      </span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase font-varela text-muted mb-0"
                        >
                          No. Meses en Mora
                          </CardTitle>
                        <span className="h2 font-weight-bold  float-right" style={{ fontSize: 30 }}>{current_user.student.monthOwed}</span>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase font-varela text-muted mb-0"
                        >
                          Valor en mora
                          </CardTitle>
                        <span className="h2 font-weight-bold  float-right" style={{ fontSize: 30 }}>$ {formatNumber(current_user.student.monthOwed * current_user.student.monthly_payment)}</span>
                      </div>
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

export default HeaderStudent
