import { formatNumber } from './functions'

export const email_recordatorio = (user) => {
    return `Se informa que a la fecha, el estudiante ${user.first_name} ${user.last_name}, de grado ${user.student.grade.name}, adeuda un valor total de $ ${formatNumber(user.student.amountOwed)}, por concepto de ${user.student.monthOwed} mensualidades atrasadas. Se le recuerda al acudiente que los pagos deben realizarse los primeros 10 días del mes. Recomendamos efectuar el pago del valor adeudado lo mas pronto posible o dirigirse al departamento financiero del colegio para acordar un compromiso de pago.`
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

export const wpp_recordatorio_examenes = (user) => {
    return `🚨 *EXAMENES FINALES* 🚨 Cordial saludo, se informa que *La próxima semana, del 28 al 30 de Marzo* se estarán realizando los exámenes finales del 1er periodo; el estudiante deberá *estar al día* con el pago de las mensualidades hasta el mes de *MARZO*. El estudiante *${user.first_name} ${user.last_name}*, adeuda un valor total de *$ ${formatNumber(user.student.amountOwed)}* Agradecemos su atención. *Atte Departamento Financiero*`
}

export const wpp_cobro_citacion = (user) => {
    return `Cordial saludo. Sr(a) *${user.student.attending}* quien registra en calidad de acudiente; Se  le informa que a la fecha, el estudiante *${user.first_name} ${user.last_name}* (Código: *${user.student.code}*), de grado ${user.student.grade.name}, adeuda un valor total de *$ ${formatNumber(user.student.amountOwed)}*, por concepto de *${user.student.monthOwed}* mensualidad(es) atrasada(s). Recomendamos colocarse al día; de lo contrario *SERÁ CITADO A LA INTITUCION*, ya que, dependemos de los recaudos por concepto de pensión para solventar los gastos y obligaciones salariales de nuestro personal. Se le recuerda al acudiente que los pagos deben realizarse los primeros 10 días del mes y *se debe enviar la foto del comprobante de pago a este WhatsApp para su registro.* Recomendamos efectuar el pago del valor adeudado lo más pronto posible. Agradecemos su atención y quedamos atentos a una pronta respuesta.`
}

export const wpp_boletines = (user) => {
    return `🚨 *ENTREGA BOLETINES* 🚨\n \nCordial saludo.\n \nMañana *JUEVES 01 DE DICIEMBRE DE 2022* se realizará la reunión de entrega de boletines del 4to periodo, recuerde que el estudiante se debe encontrar al día con el pago de las mensualidades hasta el mes de *NOVIEMBRE*. El estudiante *${user.first_name} ${user.last_name}* adeuda un valor total de *$ ${formatNumber(user.student.amountOwed)}*, por concepto de *${user.student.monthOwed}* mensualidad(es) atrasada(s). Agradecemos su atención.`
}

export const wpp_control_ingreso = (user) => {
    return `🚨 *CONTROL DE INGRESO* 🚨\n \nCordial saludo, durante la próxima semana del *LUNES 12 AL VIERNES 16 DE SEPTIEMBRE* se estará solicitando *la agenda* al estudiante al ingreso a la institución, la cual deberá tener los sellos hasta el mes de *SEPTIEMBRE*. (El día viernes 09 se estarán sellando las agendas). *${user.first_name} ${user.last_name}*, adeuda un valor total de *$ ${formatNumber(user.student.amountOwed)}*. Agradecemos su atención.`
}

