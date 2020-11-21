import axios from 'axios'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const SENDING = 'SENDING'
export const SENT = 'SENT'


export const sendEmail = (email, toggle) => async (dispatch) => {

    toggle()
    dispatch({ type: SENDING })

    let url = `${host}api/v1/contact/email/`
    await axios.post(url, email)
        .then(response => {
            console.log(response)
            dispatch({
                type: SENT,
            })
            Swal.fire({
                icon: 'success',
                showConfirmButton: true,
                html:
                    `Se envio <b>1</b> correo exitosamente`
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: SENT })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const sendSms = (message, toggle) => async (dispatch) => {

    console.log(message)
    toggle()
    dispatch({ type: SENDING })

    let url = `${host}api/v1/contact/sms/`
    await axios.post(url, message)
        .then(response => {
            console.log(response)
            dispatch({
                type: SENT,
            })
            Swal.fire({
                icon: 'success',
                showConfirmButton: true,
                html:
                    `Se envio <b>1</b> mensaje exitosamente`
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: SENT })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const sendWpp = (message) => async (dispatch) => {

    console.log(message)
    dispatch({ type: SENDING })

    let url = `${host}api/v1/contact/wpp/`
    await axios.post(url, message)
        .then(response => {
            console.log(response)
            dispatch({
                type: SENT,
            })
            Swal.fire({
                icon: 'success',
                showConfirmButton: true,
                html:
                    `Se envio <b>1</b> mensaje exitosamente`
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: SENT })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const sendSmsMassive = (users, msg, phoneTo) => async (dispatch) => {

    dispatch({ type: SENDING })

    const smss = []
    users.map(function (user) {
        const message = {
            user: `${user.last_name} ${user.first_name} - ${user.student.code}`,
            sms: msg(user),
            phone_to: `+57${phoneTo === '1' ? user.student.phone1 : user.student.phone2}`
        }
        return smss.push(message)
    })

    let url = `${host}api/v1/contact/sms/massive/`
    await axios.post(url, smss)
        .then(response => {
            dispatch({
                type: SENT,
            })
            Swal.fire({
                icon: response.data.not_sent.length === 0 ? 'success' : 'warning',
                showConfirmButton: true,
                html:
                    `Se enviaron <b>${response.data.sent}</b> sms exitosamente </br></br>` +
                    `<ul style="font-size: 13px;text-align: initial;">
                        <b>Fallos: ${response.data.not_sent.length}</b></br>
                        ${response.data.not_sent.map(name => (`<li>${name}</li>`))}
                    </ul>`.replace(/,/g, '')
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: SENT })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const sendEmailMassive = (users, sms) => async (dispatch) => {

    dispatch({ type: SENDING })

    const emails = []
    users.map(function (user) {
        const email = {
            user: `${user.last_name} ${user.first_name} - ${user.student.code}`,
            email_destination: user.email,
            content: sms(user)
        }
        return emails.push(email)
    })

    console.log(emails)

    let url = `${host}api/v1/contact/email/massive/`
    await axios.post(url, emails)
        .then(response => {
            dispatch({
                type: SENT,
            })
            Swal.fire({
                icon: response.data.not_sent.length === 0 ? 'success' : 'warning',
                showConfirmButton: true,
                html:
                    `Se enviaron <b>${response.data.sent}</b> correos exitosamente </br></br>` +
                    `<ul style="font-size: 13px;text-align: initial;">
                        <b>Fallos: ${response.data.not_sent.length}</b></br>
                        ${response.data.not_sent.map(name => (`<li>${name}</li>`))}
                    </ul>`.replace(/,/g, '')
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: SENT })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}