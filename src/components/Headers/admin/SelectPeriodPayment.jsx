import React from "react";
import { useDispatch } from 'react-redux'
import { Row, FormGroup, Input, InputGroup } from "reactstrap";
import { fetchPaymentsByPeriod } from '../../../redux/actions/paymentActions'

export const SelectPeriodPayment = () => {

    const dispatch = useDispatch()


    const selectPeriod = (e) => {
        const per = e.target.value
        dispatch(fetchPaymentsByPeriod(per))
    }


    return (
        <Row>
            <FormGroup className="animate__animated animate__fadeIn ml-5">
                <InputGroup id='input-group-login' className="input-group-alternative">
                    <Input
                        className="input_search" style={{ borderTopLeftRadius: 20, borderBottomLeftRadius: 20, backgroundColor: 'transparent', paddingLeft: 30, width: 400 }}
                        type="select" name="period" onChange={selectPeriod} defaultValue="0">
                        <option value='0' disabled>Seleccione un Periodo</option>
                        <option value={1}>Enero</option>
                        <option value={2}>Febrero</option>
                        <option value={3}>Marzo</option>
                        <option value={4}>Abril</option>
                        <option value={5}>Mayo</option>
                        <option value={6}>Junio</option>
                        <option value={7}>Julio</option>
                        <option value={8}>Agosto</option>
                        <option value={9}>Septiembre</option>
                        <option value={10}>Octubre</option>
                        <option value={11}>Noviembre</option>
                        <option value={12}>Diciembre</option>
                    </Input>
                </InputGroup>
            </FormGroup>
        </Row>
    )
}

export default SelectPeriodPayment;