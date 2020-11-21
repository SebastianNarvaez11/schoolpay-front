import React, {  useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Card, CardBody, Container, Row, Col } from "reactstrap";
import { ModalSpinner } from '../../Spinner/ModalSpinner'
import { fetchDataGraphics } from '../../../redux/actions/studentActions'

export const HeaderReports = () => {

    const dispatch = useDispatch()
    const { data_graphics, isFetchingData } = useSelector(state => state.studentReducer)


    useEffect(() => {
        if (data_graphics.length === 0) {
            dispatch(fetchDataGraphics())
        }
        //  eslint-disable-next-line
    }, [dispatch]);



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
                                            <h3 className="mb-0 font-varela ml-3" style={{ fontSize: '20px' }}>Filtro y Reportes</h3>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </Container>
                <ModalSpinner isLoading={isFetchingData} text={'Cargando Datos ...'} />
            </div>
        </>
    )
}

export default HeaderReports;