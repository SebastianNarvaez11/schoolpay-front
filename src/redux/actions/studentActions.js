import axios from 'axios'
import { Toast } from '../../assets/alerts'
import Swal from 'sweetalert2'
import { host } from '../../helpers/host.js'
import { SELECT_GRADE, RESET_GRADE } from './gradeActions'

export const START_FETCH_STUDENTS = 'START_FETCH_STUDENTS'
export const FINISH_FETCH_STUDENTS = 'FINISH_FETCH_STUDENTS'
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
export const START_FETCH_DATA_GRAPHICS = 'START_FETCH_DATA_GRAPHICS'
export const FINISH_FETCH_DATA_GRAPHICS = 'FINISH_FETCH_DATA_GRAPHICS'

export const START_FETCH_STUDENT = 'START_FETCH_STUDENT'
export const FINISH_FETCH_STUDENT = 'FINISH_FETCH_STUDENT'

export const START_FETCH_STUDENT_BY_GRADE = 'START_FETCH_STUDENT_BY_GRADE'
export const FINISH_FETCH_STUDENT_BY_GRADE = 'FINISH_FETCH_STUDENT_BY_GRADE'

export const FETCH_DATA_REPORTS = 'FETCH_DATA_REPORTS'
export const START_FETCH_DATA_REPORTS = 'START_FETCH_DATA_REPORTS'
export const FINISH_FETCH_DATA_REPORTS = 'FINISH_FETCH_DATA_REPORTS'

export const fetchStudents = () => async (dispatch) => {

    dispatch({ type: START_FETCH_STUDENTS })


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
            dispatch({ type: FINISH_FETCH_STUDENTS })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un problema al cargar los estudiantes'
            })
        })
}

export const getStudentFull = (id) => async (dispatch) => {

    dispatch({ type: START_FETCH_STUDENT })

    let url = `${host}api/v1/users/student/get/${id}/`
    await axios.get(url)
        .then(response => {
            dispatch({
                type: UPDATE_STUDENT_FULL,
                payload: {
                    user: response.data
                }
            })
        })
        .catch(error => {
            dispatch({ type: FINISH_FETCH_STUDENT })
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
            user.student.compromises = student.compromises
            user.student.payments = student.payments

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

    dispatch({ type: START_FETCH_STUDENT_BY_GRADE })

    let url = `${host}api/v1/users/student/list/${grade.id}/${schedule}/`
    await axios.get(url)
        .then(response => {

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
            dispatch({ type: FINISH_FETCH_STUDENT_BY_GRADE })
            console.log(error)
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upps! Ha ocurrido un error al cargar los estudiantes'
            })
        })
}

export const fetchDataGraphics = () => async (dispatch) => {

    dispatch({ type: START_FETCH_DATA_GRAPHICS })

    let url = `${host}api/v1/users/student/list/debt/`
    axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_DATA_GRAPHICS,
                payload: {
                    students: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: FINISH_FETCH_DATA_GRAPHICS })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los datos'
            })
        })
}

export const fetchDataReports = () => async (dispatch) => {

    dispatch({ type: START_FETCH_DATA_REPORTS })

    let url = `${host}api/v1/users/student/list/report/`
    axios.get(url)
        .then(response => {
            dispatch({
                type: FETCH_DATA_REPORTS,
                payload: {
                    students: response.data
                }
            })
        })
        .catch(error => {
            console.log(error)
            dispatch({ type: FINISH_FETCH_DATA_REPORTS })
            Swal.fire({
                icon: 'error',
                showConfirmButton: true,
                text: 'Upss! Ha ocurrido un error al cargar los datos'
            })
        })
}