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
        return 'Feb-Nov'
    } else if (e === 9) {
        return 'Mar-Nov'
    } else if (e === 8) {
        return 'Abr-Nov'
    } else if (e === 7) {
        return 'May-Nov'
    } else if (e === 6) {
        return 'Jun-Nov'
    } else if (e === 5) {
        return 'Jul-Nov'
    } else if (e === 4) {
        return 'Ago-Nov'
    } else if (e === 3) {
        return 'Sep-Nov'
    } else if (e === 2) {
        return 'Oct-Nov'
    }
}

// cantidad de deudores
export const amountOfDebtors = (grade, schedule, students) => {
    if (students !== undefined) {
        return students.filter(student => student.student.grade.id === grade && student.student.schedule === schedule && student.student.monthOwed !== 0).length
    }else {
        return 0
    }
}

//total adeudado por grado
export const totalOwed = (grade, schedule, students) => {
    let total = 0
    if (students !== undefined) {
        const students_filter = students.filter(student => student.student.grade.id === grade && student.student.schedule === schedule)
        students_filter.forEach(student => {
            total = total + student.student.amountOwed
        })
    }
    return total
}

export const enMora = (data) => {
    if (data !== undefined) {
        return data.filter(data => data.student.monthOwed !== 0).length
    } else {
        return 0
    }
}


export const alDia = (data) => {
    if (data !== undefined) {
        return data.filter(data => data.student.monthOwed === 0).length
    } else {
        return 0
    }
}


export const unMes = (data) => {
    if (data !== undefined) {
        return data.filter(data => data.student.monthOwed === 1).length
    } else {
        return 0
    }
}


export const dosMeses = (data) => {
    if (data !== undefined) {
        return data.filter(data => data.student.monthOwed === 2).length
    } else {
        return 0
    }
}


export const tresMeses = (data) => {
    if (data !== undefined) {
        return data.filter(data => data.student.monthOwed >= 3).length
    } else {
        return 0
    }
}