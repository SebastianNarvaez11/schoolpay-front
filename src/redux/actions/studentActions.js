import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { SELECT_GRADE, RESET_GRADE } from './gradeActions'

export const FETCHING_STUDENTS = 'FETCHING_STUDENTS'
export const FETCH_STUDENTS = 'FETCH_STUDENTS'
export const CREATE_STUDENT = 'CREATE_STUDENT'
export const UPDATE_STUDENT = 'UPDATE_STUDENT'
export const DELETE_STUDENT = 'DELETE_STUDENT'
export const FILTER_STUDENT = 'FILTER_STUDENT'
export const FILTER_STUDENT_GRADE = 'FILTER_STUDENT_GRADE'
export const RESET_STUDENT_SELECT = 'RESET_STUDENT_SELECT'
export const UPDATE_STUDENT_SELECT = 'UPDATE_STUDENT_SELECT'
export const UPDATE_STUDENT_FULL = 'UPDATE_STUDENT_FULL'
export const FETCH_DATA_GRAPHICS = 'FETCH_DATA_GRAPHICS'
export const FETCHING_DATA_GRAPHICS = 'FETCHING_DATA_GRAPHICS'

export const fetchStudents = () => async (dispatch) => {

    dispatch({ type: FETCHING_STUDENTS })


    let url = `${host}api/v1/users/student/list/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_STUDENTS,
                payload: {
                    students: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
            })
        })
}

export const getStudentFull = (id) => async (dispatch) => {

    let url = `${host}api/v1/users/student/get/${id}/`
    await axios.get(url)
        .then(response => {
            console.log(response.data)
            dispatch({
                type: UPDATE_STUDENT_FULL,
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

export const createStudent = (student, user, grade, toggle) => async (dispatch) => {

    student.grade = grade.id
    let url = `${host}api/v1/users/student/create/`
    await axios.post(url, student)
        .then(response => {
            response.data.grade = grade
            user.student = response.data
            console.log(user)
            dispatch({
                type: CREATE_STUDENT,
                payload: {
                    user: user
                }
            })
            toggle()
            Toast.fire({ icon: 'success', title: 'Estudiante creado correctamente' })//alert success

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: user
                }
            })

        }).catch(error => {
            console.log(error.response)
            console.log(error.response.data.error)
            //se elimina el usuario creado
            axios.delete(`${host}api/v1/users/delete/${user.id}/`)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const updateStudent = (student, user, grade, toggle) => async (dispatch) => {

    student.grade = grade.id
    let url = `${host}api/v1/users/student/update/${student.id}/`
    await axios.put(url, student)
        .then(response => {
            response.data.grade = grade
            user.student = response.data
            console.log(user)
            dispatch({
                type: UPDATE_STUDENT,
                payload: {
                    user: user
                }
            })

            dispatch({
                type: UPDATE_STUDENT_SELECT,
                payload: {
                    user: user
                }
            })

            // eslint-disable-next-line
            { toggle && toggle() }
            Toast.fire({ icon: 'success', title: 'Estudiante actualizado correctamente' })//alert success
        }).catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}


export const deleteStudent = (student, user) => async (dispatch) => {
    user.student = student.id
    console.log(student)
    console.log(user)
    let url = `${host}api/v1/users/update/${user.id}/`
    await axios.put(url, user)
        .then(response => {
            response.data.student = student
            dispatch({
                type: DELETE_STUDENT,
                payload: {
                    user: response.data,
                }
            })
            Toast.fire({ icon: 'success', title: 'Estudiante Eliminado correctamente' })//alert success
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: Object.values(error.response.data)[0]
            })
        })
}

export const filterStudents = (text) => async (dispatch) => {
    dispatch({
        type: FILTER_STUDENT,
        payload: {
            text: text
        }
    })
}

export const resetStudentSelect = () => async (dispatch) => {

    dispatch({
        type: RESET_GRADE
    })

    dispatch({
        type: RESET_STUDENT_SELECT
    })
}



export const filterStudentsGrade = (grade, schedule) => async (dispatch) => {

    console.log(grade, schedule)
    dispatch({ type: FETCHING_STUDENTS })

    let url = `${host}api/v1/users/student/list/${grade.id}/${schedule}/`
    await axios.get(url)
        .then(response => {
            console.log(response.data)

            dispatch({
                type: SELECT_GRADE,
                payload: {
                    grade: grade
                }
            })

            dispatch({
                type: FILTER_STUDENT_GRADE,
                payload: {
                    students: response.data,
                    schedule: schedule
                }
            })
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: error
            })
        })
}

export const fetchDataGraphics = () => async (dispatch) => {

    dispatch({type : FETCHING_DATA_GRAPHICS})

    let url = `${host}api/v1/users/student/list/debt/`
    axios.get(url)
        .then(response => {
            dispatch({
                type : FETCH_DATA_GRAPHICS,
                payload: {
                    students : response.data
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