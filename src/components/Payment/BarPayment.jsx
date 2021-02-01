import React, { Fragment } from 'react'
import { Progress } from 'reactstrap'

export const BarPayment = ({ student }) => {

    const monthly_payment = student.monthly_payment
    const total_year = student.total_year
    const total_paid = student.total_paid

    const renderMonths = () => {
        // calculamos los meses pagados
        const months_pay = Math.floor(total_paid / monthly_payment)

        if (student.coverage) {
            return <p>COBERTURA</p>;

        } else if ((months_pay + (10 - student.initial_charge)) === 1) {
            return <p>FEBRERO</p>;

        } else if ((months_pay + (10 - student.initial_charge)) === 2) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 3) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 4) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 5) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 6) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p><p>JULIO</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 7) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p><p>JULIO</p><p>AGOSTO</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 8) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p><p>JULIO</p><p>AGOSTO</p><p>SEPTIEMBRE</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 9) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p><p>JULIO</p><p>AGOSTO</p><p>SEPTIEMBRE</p><p>OCTUBRE</p></Fragment>;

        } else if ((months_pay + (10 - student.initial_charge)) === 10) {
            return <Fragment><p>FEBRERO</p><p>MARZO</p><p>ABRIL</p><p>MAYO</p><p>JUNIO</p><p>JULIO</p><p>AGOSTO</p><p>SEPTIEMBRE</p><p>OCTUBRE</p><p>NOVIEMBRE</p></Fragment>;
        }

    }


    const changeColorBar = () => {
        const n = student.monthOwed
        const e = student.amountOwed

        if (student.coverage) {
            return "info"
        }
        else if (student.compromises.filter(compromise => compromise.state === 1).length !== 0) {
            return "primary"
        }
        else if (n >= 3) {
            return "danger"
        }
        else if (n >= 1 || e !== 0) {
            return "warning"
        }
        else if (n === 0) {
            return "success"
        }
    }

    return (
        <Progress style={{ height: '50px' }} animated={!student.coverage} color={changeColorBar()} value={student.coverage ? total_year: total_paid} max={total_year}>
            <div className="d-flex justify-content-around mt-3 font-varela">
                {renderMonths()}
            </div>
        </Progress>
    )
}

export default BarPayment
