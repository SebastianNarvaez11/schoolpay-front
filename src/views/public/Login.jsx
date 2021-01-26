import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Container, Card, CardBody, Form, Button, FormGroup, Label, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Col } from 'reactstrap'
import ModalSpinner from '../../components/Spinner/ModalSpinner'
import { loginUser } from '../../redux/actions/authActions'
import '../../assets/css/login.css'
import logo from '../../assets/img/logosp3.png'

const Login = () => {
    const { isLoggedIn, current_user, startLogin } = useSelector(state => state.authReducer)
    const dispatch = useDispatch()


    const [login, setLogin] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = login
        dispatch(loginUser(data))
    }


    if (isLoggedIn) {
        if (current_user.type === 1 || current_user.type === 2) {
            return <Redirect to='/admin' />
        }
        if (current_user.type === 3) {
            return <Redirect to='/student' />
        }
    }

    return (
        < >
            <Row className='text-center'>
                <Col>
                    <p id='welcome' className='mt-5'>Bienvenido!</p>
                    <p id='text-info'>SchoolPay es la plataforma que le permite realizar y gestinar los pagos de <br /> las colegiaturas de sus hijos.</p>
                </Col>
            </Row>
            <Container className='d-flex justify-content-center'>
                <Card id='card-login' style={{ width: '30rem' }}>
                    <CardBody>
                        <div className="text-center mb-1">
                            <img
                                alt="logo_de_schoolpay"
                                src={logo}
                                height='250'
                            />
                        </div>

                        <Container>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Label id='text-info' className="mr-sm-2">Usuario</Label>
                                    <InputGroup id='input-group-login' className="input-group-alternative mb-4">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fas fa-user"></i>
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input className="form-control-alternative" name='username' placeholder="Username" type="text" onChange={handleChange} />
                                    </InputGroup>
                                </FormGroup>
                                <FormGroup>
                                    <Label id='text-info' className="mr-sm-2">Contraseña</Label>
                                    <InputGroup id='input-group-login' className="input-group-alternative mb-4">
                                        <InputGroupAddon addonType="prepend">
                                            <InputGroupText>
                                                <i className="fas fa-key" />
                                            </InputGroupText>
                                        </InputGroupAddon>
                                        <Input className="form-control-alternative" name='password' placeholder="Contraseña" type="password" onChange={handleChange} />
                                    </InputGroup>
                                </FormGroup>
                                <Button block id='btn' className='mb-3' color="primary" size="lg" type="submit">
                                    Ingresar
                                </Button>
                            </Form>
                            <Link to='' id='text-info'>¿Olvidaste tu contraseña?</Link>
                        </Container>
                    </CardBody>
                </Card>
            </Container>
            <Container>
                <Row className='pt-5'>
                    <Col>
                        <Link to='' id='text-info'>© 2020 Sebas Developer</Link>
                    </Col>
                </Row>
            </Container>
            <ModalSpinner isLoading={startLogin} text={'Ingresando...'} />
        </>
    )
}

export default Login
