// funcion para formatear un numero a dinero
export const formatNumber = (number) => {
    return new Intl.NumberFormat('ES-CO', {
        style: 'decimal',
        currency: 'COP'
    }).format(number)
}


export const scheduleFormat = (e) => {
    if (e === 1) {
        return 'Mañana'
    } else if (e === 2) {
        return 'Tarde'
    } else if (e === 3) {
        return 'Unica'
    }
}

export const initialCharge = (e) => {
    if (e === 10) {
        return 'Febrero-Noviembre'
    } else if (e === 9) {
        return 'Marzo-Noviembre'
    } else if (e === 8) {
        return 'Abril-Noviembre'
    } else if (e === 7) {
        return 'Mayo-Noviembre'
    } else if (e === 6) {
        return 'Junio-Noviembre'
    } else if (e === 5) {
        return 'Julio-Noviembre'
    } else if (e === 4) {
        return 'Agosto-Noviembre'
    } else if (e === 3) {
        return 'Septiembre-Noviembre'
    } else if (e === 2) {
        return 'Octubre-Noviembre'
    }
}

export const amountOfDebtors = (grade, schedule, students) => {
    return students.filter(student =>  student.student.grade.id === grade && student.student.schedule === schedule && student.student.monthOwed !== 0 ).length
}