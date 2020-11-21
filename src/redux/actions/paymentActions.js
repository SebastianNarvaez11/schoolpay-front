import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { UPDATE_STUDENT, UPDATE_STUDENT_SELECT } from '../actions/studentActions'

export const CREATE_PAYMENT = 'CREATE_PAYMENT'
export const DELETE_PAYMENT = 'DELETE_PAYMENT'


export const createPaymentManual = (payment) => async (dispatch) => {

    let url = `${host}api/v1/payments/student/create/manual/`
    await axios.post(url, payment)
        .then(response => {
            console.log(response.data)
            Toast.fire({ icon: 'success', title: 'Pago registrado con exito' })//alert success
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