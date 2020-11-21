import {
    FETCHING_STUDENTS, FETCH_STUDENTS,
    CREATE_STUDENT, UPDATE_STUDENT,
    DELETE_STUDENT, FILTER_STUDENT,
    RESET_STUDENT_SELECT, UPDATE_STUDENT_SELECT,
    UPDATE_STUDENT_FULL, FILTER_STUDENT_GRADE,
    FETCH_DATA_GRAPHICS, FETCHING_DATA_GRAPHICS
} from '../actions/studentActions'

const initialState = {
    students: [],//usuario de tipo student
    student_full: {},//student completo de donde se leen los datos
    isFetching: false,
    student_select: {},//student que activa el cambio para que no haya ciclo
    students_filter: [],
    schedule_select: '',
    data_graphics: [],//datos que se cargan para realizar los graficos, los filtros totales y reportes
    isFetchingData: false,
}

const studentReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCHING_STUDENTS:
            return {
                ...state,
                isFetching: true
            }

        case FETCH_STUDENTS:
            return {
                ...state,
                students: action.payload.students,
                isFetching: false
            }

        case CREATE_STUDENT:
            return {
                ...state,
                students: [action.payload.user, ...state.students]
            }

        case UPDATE_STUDENT:
            return {
                ...state,
                students: state.students.map(student =>
                    student.id === action.payload.user.id ? (student = action.payload.user) : student),
                
                //para actualizar los porcentajes cuando se registren los pagos manuales
                data_graphics : state.data_graphics.map(student =>
                    student.id === action.payload.user.id ? (student = action.payload.user) : student),
            }

        case DELETE_STUDENT:
            return {
                ...state,
                students: state.students.filter(student => student.id !== action.payload.user.id),
                student_full: {}
            }

        case FILTER_STUDENT:
            var text = action.payload.text
            const data = state.students
            const newData = data.filter(function (item) {
                const code = item.student.code.toUpperCase()
                const first_name = item.first_name.toUpperCase()
                const last_name = item.last_name.toUpperCase()
                const campo = code + " " + last_name + " " + first_name
                const textData = text.toUpperCase()
                return campo.indexOf(textData) > -1
            })

            return {
                ...state,
                students_filter: newData,
                student_select: (newData[0] === undefined ? state.student_select : newData[0])
            }

        case FILTER_STUDENT_GRADE:
            return {
                ...state,
                schedule_select: action.payload.schedule,
                students_filter: action.payload.students,
                isFetching: false
            }


        case RESET_STUDENT_SELECT:
            return {
                ...state,
                student_full: {},
                student_select: {},
                students_filter: []
            }

        case UPDATE_STUDENT_SELECT:
            return {
                ...state,
                student_select: action.payload.user
            }

        case UPDATE_STUDENT_FULL:
            return {
                ...state,
                student_full: action.payload.user
            }

        case FETCHING_DATA_GRAPHICS:
            return {
                ...state,
                isFetchingData: true
            }

        case FETCH_DATA_GRAPHICS:
            return {
                ...state,
                data_graphics: action.payload.students,
                isFetchingData: false
            }

        default:
            return state
    }
}

export default studentReducer