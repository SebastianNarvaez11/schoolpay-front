import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { UPDATE_STUDENT, UPDATE_STUDENT_SELECT } from '../actions/studentActions'

export const START_FETCH_PAYMENTS = 'START_FETCH_PAYMENTS'
export const FINISH_FETCH_PAYMENTS = 'FINISH_FETCH_PAYMENTS'

export const START_CREATE_PAYMENT_MANUAL = 'START_CREATE_PAYMENT_MANUAL'
export const FINISH_CREATE_PAYMENT_MANUAL = 'FINISH_CREATE_PAYMENT_MANUAL'
export const FETCH_PAYMENTS = 'FETCH_PAYMENTS'
export const CREATE_PAYMENT = 'CREATE_PAYMENT'
export const DELETE_PAYMENT = 'DELETE_PAYMENT'
export const START_FETCH_COMPROMISES = 'START_FETCH_COMPROMISES'
export const FINISH_FETCH_COMPROMISES = 'FINISH_FETCH_COMPROMISES'
export const FETCH_COMPROMISES = 'FETCH_COMPROMISES'
export const CREATE_COMPROMISE = 'CREATE_COMPROMISE'
export const UPDATE_COMPROMISE_SINCE_LIST = 'UPDATE_COMPROMISE_SINCE_LIST'
export const DELETE_COMPROMISE = 'DELETE_COMPROMISE'
export const GET_STUDENT_FULL = 'GET_STUDENT_FULL'
export const START_FETCH_STUDENT_COMPROMISE = 'START_FETCH_STUDENT_COMPROMISE'
export const FINISH_FETCH_STUDENT_COMPROMISE = 'FINISH_FETCH_STUDENT_COMPROMISE'
export const RESET_STUDENT_FULL = 'RESET_STUDENT_FULL'

export const START_FETCH_PAYMENTS_BY_PERIOD = 'START_FETCH_PAYMENTS_BY_PERIOD'
export const FINISH_FETCH_PAYMENTS_BY_PERIOD = 'FINISH_FETCH_PAYMENTS_BY_PERIOD'


export const fetchPayments = () => async (dispatch) => {

    dispatch({ type: START_FETCH_PAYMENTS })

    let url = `${host}api/v1/payments/student/list/`

    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_PAYMENTS,
                payload: {
                    payments: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: FINISH_FETCH_PAYMENTS })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los pagos'
            })
        })

}

export const fetchPaymentsByPeriod = (period) => async (dispatch) => {

    dispatch({ type: START_FETCH_PAYMENTS_BY_PERIOD })

    let url = `${host}api/v1/payments/period/${period}/`
    await axios.get(url)
        .then(response => {
            console.log(response)
            dispatch({
                type: FETCH_PAYMENTS,
                payload: {
                    payments: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_PAYMENTS_BY_PERIOD })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al cargar los pagos'
            })
        })
}

export const createPaymentManual = (payment) => async (dispatch) => {

    dispatch({ type: START_CREATE_PAYMENT_MANUAL })

    let url = `${host}api/v1/payments/student/create/manual/`
    await axios.post(url, payment)
        .then(response => {
            console.log(response.data)
            Toast.fire({ icon: 'success', title: 'Pago registrado con exito' })//alert success
            const pay = response.data.payment
            pay.student = response.data.student.student
            pay.student.user = response.data.student

            dispatch({
                type: CREATE_PAYMENT,
                payload: {
                    payment: pay
                }
            })

            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: response.data.student
                }
            })
            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: response.data.student
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_CREATE_PAYMENT_MANUAL })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const deletePaymentManual = (id) => async (dispatch) => {

    let url = `${host}api/v1/payments/student/delete/manual/${id}/`

    await axios.delete(url)
        .then(response => {
            console.log(response)

            Toast.fire({ icon: 'success', title: 'Pago eliminado correctamente' })//alert success
            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: response.data
                }
            })

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const createCompromise = (compromise, toggle) => async (dispatch) => {

    let url = `${host}api/v1/payments/compromise/create/`

    await axios.post(url, compromise)
        .then(response => {
            console.log(response)

            const comp = response.data.student.compromises[0]
            comp.student = response.data.student
            comp.student.user = response.data

            dispatch({
                type: CREATE_COMPROMISE,
                payload: {
                    compromise: comp
                }
            })

            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: response.data
                }
            })

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: response.data
                }
            })
            Toast.fire({ icon: 'success', title: 'Compromiso creado correctamente' })//alert success
            toggle()
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const fetchCompromises = () => async (dispatch) => {

    dispatch({ type: START_FETCH_COMPROMISES })

    let url = `${host}api/v1/payments/compromise/list/`

    await axios.get(url)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: FETCH_COMPROMISES,
                payload: {
                    compromises: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: FINISH_FETCH_COMPROMISES })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los compromisos de pago'
            })
        })

}


export const updateCompromiseSinceList = (compromise) => async (dispatch) => {

    let url = `${host}api/v1/payments/compromise/update/${compromise.id}/`

    axios.put(url, compromise)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_COMPROMISE_SINCE_LIST,
                payload: {
                    compromise: response.data
                }
            })

            Toast.fire({ icon: 'success', title: 'Compromiso actualizado correctamente' })//alert success
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const updateCompromiseSinceDetail = (compromise) => async (dispatch) => {

    let url = `${host}api/v1/payments/compromise/update2/${compromise.id}/`

    await axios.put(url, compromise)
        .then(response => {
            console.log(response)

            const comp = response.data.student.compromises[0]
            comp.student = response.data.student
            comp.student.user = response.data

            dispatch({
                type: UPDATE_COMPROMISE_SINCE_LIST,
                payload: {
                    compromise: comp
                }
            })

            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: response.data
                }
            })

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: response.data
                }
            })

            Toast.fire({ icon: 'success', title: 'Compromiso actualizado correctamente' })//alert success

        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const deleteCompromises = (id) => async (dispatch) => {

    let url = `${host}api/v1/payments/compromises/delete/${id}/`

    await axios.delete(url)
        .then(response => {
            console.log(response)

            dispatch({
                type: DELETE_COMPROMISE,
                payload: {
                    compromise: id
                }
            })

            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: response.data
                }
            })

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: response.data
                }
            })

            Toast.fire({ icon: 'success', title: 'Compromiso eliminado correctamente' })//alert success
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const getStudentFullCompromise = (id) => async (dispatch) => {
    console.log(id)
    dispatch({ type: START_FETCH_STUDENT_COMPROMISE })

    let url = `${host}api/v1/users/student/get/${id}/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: GET_STUDENT_FULL,
                payload: {
                    user: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_STUDENT_COMPROMISE })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const resetStudentFullCompromises = () => async (dispatch) => {
    dispatch({ type: RESET_STUDENT_FULL })
}