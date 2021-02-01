import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'

export const START_FETCH_GRADES = 'START_FETCH_GRADES'
export const FINISH_FETCH_GRADES = 'FINISH_FETCH_GRADES'
export const FETCH_GRADES = 'FETCH_GRADES'
export const CREATE_GRADE = 'CREATE_GRADE'
export const UPDATE_GRADE = 'UPDATE_GRADE'
export const DELETE_GRADE = 'DELETE_GRADE'
export const SELECT_GRADE = 'SELECT_GRADE'
export const RESET_GRADE = 'RESET_GRADE'



export const fetchGrades = () => async (dispatch) => {

    dispatch({ type: START_FETCH_GRADES })

    let url = `${host}api/v1/school/grade/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_GRADES,
                payload: {
                    grades: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: FINISH_FETCH_GRADES })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los grados'
            })
        })
}

export const createGrade = (grade, toggle) => async (dispatch) => {

    let url = `${host}api/v1/school/grade/`

    await axios.post(url, grade)
        .then(response => {
            dispatch({
                type: CREATE_GRADE,
                payload: {
                    grade: response.data
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Grado creado correctamente' })//alert success
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

export const updateGrade = (grade, toggle) => async (dispatch) => {

    let url = `${host}api/v1/school/grade/${grade.id}/`

    await axios.put(url, grade)
        .then(response => {
            dispatch({
                type: UPDATE_GRADE,
                payload: {
                    grade: response.data
                }
            })
            // eslint-disable-next-line
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Grado actualizado correctamente' })//alert success
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

export const deleteGrade = (grade) => async (dispatch) => {

    let url = `${host}api/v1/school/grade/${grade.id}/`

    await axios.put(url, grade)
        .then(response => {
            dispatch({
                type: DELETE_GRADE,
                payload: {
                    grade: response.data
                }
            })
            Toast.fire({ icon: 'success', title: 'Grado eliminado correctamente' })//alert success
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
