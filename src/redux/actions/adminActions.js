import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'


export const FETCH_ADMIN_USERS = 'FETCH_ADMIN_USERS'
export const CREATE_ADMIN = 'CREATE_ADMIN'
export const UPDATE_ADMIN = 'UPDATE_ADMIN'
export const DELETE_USER = 'DELETE_USER'




export const fetchAdminUsers = () => async (dispatch) => {

    let url = `${host}api/v1/users/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_ADMIN_USERS,
                payload: {
                    users: response.data
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

export const createAdmin = (user, admin, toggle) => async (dispatch) => {
    console.log(admin)
    let url = `${host}api/v1/users/admin/create/`

    await axios.post(url, admin)
        .then(response => {
            console.log(response.data)
            user.admin = response.data
            dispatch({
                type: CREATE_ADMIN,
                payload: {
                    user: user,
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Usuario creado correctamente' })//alert success
        })
        .catch(error => {
            console.log(error)
            //se elimina el usuario creado
            axios.delete(`${host}api/v1/users/delete/${user.id}/`)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const updateAdmin = (admin, user, toggle) => async (dispatch) => {
    console.log(admin)

    let url = `${host}api/v1/users/admin/update/${admin.id}/`
    await axios.put(url, admin)
        .then(response => {
            console.log(response.data)
            user.admin = response.data //volverle ah asiganar el perfil al usuario, ya que el user viene sin el perfil
            dispatch({
                type: UPDATE_ADMIN,
                payload: {
                    user: user,
                }
            })
            // eslint-disable-next-line
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Usuario actualizado correctamente' })//alert success
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}



export const deleteUser = (user) => async (dispatch) => {

    let url = `${host}api/v1/users/update/${user.id}/`
    await axios.put(url, user)
        .then(response => {

            dispatch({
                type: DELETE_USER,
                payload: {
                    user: response.data,
                }
            })
            Toast.fire({ icon: 'success', title: 'Usuario Eliminado correctamente' })//alert success
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}




