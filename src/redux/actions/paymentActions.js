import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { UPDATE_STUDENT, UPDATE_STUDENT_SELECT } from '../actions/studentActions'

export const START_FETCH_PAYMENTS = 'START_FETCH_PAYMENTS'
export const FINISH_FETCH_PAYMENTS = 'FINISH_FETCH_PAYMENTS'
export const FETCH_PAYMENTS = 'FETCH_PAYMENTS'
export const CREATE_PAYMENT = 'CREATE_PAYMENT'
export const DELETE_PAYMENT = 'DELETE_PAYMENT'
export const START_FETCH_COMPROMISES = 'START_FETCH_COMPROMISES'
export const FINISH_FETCH_COMPROMISES = 'FINISH_FETCH_COMPROMISES'
export const FETCH_COMPROMISES = 'FETCH_COMPROMISES'
export const CREATE_COMPROMISE = 'CREATE_COMPROMISE'


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
            // Swal.fire({
            //     icon: 'error',
            //     showConfirmButton: true,
            //     text: 'Upss! Ha ocurrido un error al cargar los pagos'
            // })
        })

}

export const createPaymentManual = (payment) => async (dispatch) => {

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