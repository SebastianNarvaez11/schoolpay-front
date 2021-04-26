import { formatNumber } from './functions'

export const email_recordatorio = (user) => {
    return `Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. Se le recuerda al acudiente que los pagos deben realizarse los primeros 10 dias del mes. Recomendamos efectuar el pago del valor adeudado lo mas pronto posible o dirigirse al departamento financiero del colegio para acordar un compromiso de pago.`
}

export const sms_recordatorio = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO \n  \n*Mensaje Recordatorio* \n \nSeñor padre de familia cordial saludo, recuerde que el pago de la mensualidad se debe realizar los 10 primeros días de cada mes; esto con el fin, de dar cumplimiento a las obligaciones administrativas y  financieras de la institución. \n \n*Si ya canceló agradecemos su pronto pago y compromiso.* \n \nAtte Departamento Financiero`
}

export const wpp_recordatorio = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO \n  \n*Mensaje Recordatorio* \n \nSeñor padre de familia cordial saludo, recuerde que el pago de la mensualidad se debe realizar los 10 primeros días de cada mes; esto con el fin, de dar cumplimiento a las obligaciones administrativas y  financieras de la institución. \n \n*Si ya canceló agradecemos su pronto pago y compromiso.* \n \nAtte Departamento Financiero`
}

export const wpp_cobro = (user) => {
    return `COLEGIO ACADÉMICO EL POBLADO:\n \nCordial saludo.\n \nSe informa que a la fecha, el estudiante *${user.first_name} ${user.last_name}* (Código: *${user.student.code}*), de grado ${user.student.grade.name}, adeuda un valor total de *$ ${formatNumber(user.student.amountOwed)}*, por concepto de *${user.student.monthOwed}* mensualidad(es) atrasada(s). Se le recuerda al acudiente que los pagos deben realizarse los primeros 10 días del mes y *se debe enviar la foto del comprobante de pago a este WhatsApp para su registro.* Recomendamos efectuar el pago del valor adeudado lo más pronto posible. Agradecemos su atención y quedamos atentos a una pronta respuesta.`
}

export const wpp_recordatorio_compromiso = (compromise) => {
    return `COLEGIO ACADÉMICO EL POBLADO: \n \nCordial saludo. \n \nSe le recuerda al acudiente que tiene un compromiso de pago pendiente para el estudiante *${compromise.student.user.first_name} ${compromise.student.user.last_name}*, de grado *${compromise.student.grade.name}*, por un valor total de $ *${formatNumber(compromise.value)}*, por concepto de *${compromise.month_owed}* mensualidad(es) atrasada(s). Agradecemos su atención.`
}