import { formatNumber } from './functions'

export const email_recordatorio = (user) => {
    return `Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. Se le recuerda al acudiente que los pagos deben realizarse los primeros 5 dias del mes. Recomendamos efectuar el pago del valor adeudado lo mas pronto posible o dirigirse al departamento financiero del colegio para acordar un compromiso de pago.`
}

export const sms_recordatorio = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO: Cordial saludo. Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. SMS DE PRUEBA`
}

export const wpp_recordatorio = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO: Cordial saludo. Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name} (Código: ${user.student.code}), de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidad(es) atrasadas. Se le recuerda al acudiente que los pagos deben realizarse los primeros 5 días del mes y se debe enviar la foto del comprobante de pago a este WhatsApp para su registro. Recomendamos efectuar el pago del valor adeudado lo más pronto posible. Agradecemos su atención y quedamos atentos a una pronta respuesta.`
}

export const wpp_recordatorio2 = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO - SEGUNDO LLAMADO: Cordial saludo. Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name} (Código: ${user.student.code}), de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidad(es) atrasada(s). Se le recuerda al acudiente que los pagos deben realizarse los primeros 5 días del mes y se debe enviar la foto del comprobante de pago a este WhatsApp para su registro. Recomendamos efectuar el pago del valor adeudado lo más pronto posible. EVITE RECARGOS POR MORA.  Agradecemos su atención y quedamos atentos a una pronta respuesta.`
}