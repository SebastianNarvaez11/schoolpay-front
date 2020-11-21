import { formatNumber} from './functions'

export const email_recordatorio = (user) => {
    return `Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. Se le recuerda al acudiente que los pagos deben realizarse los primeros 5 dias del mes. Recomendamos efectuar el pago del valor adeudado lo mas pronto posible o dirigirse al departamento financiero del colegio para acordar un compromiso de pago.`
}

export const sms_recordatorio = (user) => {
    return `COLEGIO ACADEMICO EL POBLADO: Cordial saludo. Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. SMS DE PRUEBA`
}