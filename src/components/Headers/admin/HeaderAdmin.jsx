import React from "react";
import { useSelector } from 'react-redux'
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";

const HeaderAdmin = () => {

  const { students } = useSelector(state => state.studentReducer)

  return (
    <div className="header bg-gradient-info pb-9  pt-md-4" >
      <Container >
        <div className="header-body">
          {/* Card stats */}
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
                        No. Estudiantes
                          </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        {students.length}
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
            <Col lg="6" xl="3">
              <Card className="card-stats mb-4 mb-xl-0">
                <CardBody>
                  <Row>
                    <div className="col">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase font-varela text-muted mb-0"
                      >
                        En Mora
                          </CardTitle>
                      <span className="h2 font-weight-bold mb-0">
                        127
                          </span>
                    </div>
                    <Col className="col-auto">
                      <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                        <i className="fas fa-chart-pie" />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default HeaderAdmin


