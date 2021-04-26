import {
    START_FETCH_STUDENTS, FINISH_FETCH_STUDENTS,
    FETCH_STUDENTS,
    CREATE_STUDENT, UPDATE_STUDENT,
    DELETE_STUDENT, FILTER_STUDENT,
    RESET_STUDENT_SELECT, UPDATE_STUDENT_SELECT,
    UPDATE_STUDENT_FULL, FILTER_STUDENT_GRADE,
    FETCH_DATA_GRAPHICS, START_FETCH_DATA_GRAPHICS,
    FINISH_FETCH_DATA_GRAPHICS,
    START_FETCH_STUDENT,
    FINISH_FETCH_STUDENT,
    START_FETCH_STUDENT_BY_GRADE,
    FINISH_FETCH_STUDENT_BY_GRADE,
    START_FETCH_DATA_REPORTS,
    FINISH_FETCH_DATA_REPORTS,
    FETCH_DATA_REPORTS
} from '../actions/studentActions'

const initialState = {
    students: [],//usuario de tipo student que se usan para filtrar en el input
    student_full: {},//student completo de donde se leen los datos
    isFetching: false,//cargando estudiantyes que filtran en el input
    isFetchingStudent: false,// cuando se hace la busqueda en el input
    isFetchingStudentByGrade: false,
    student_select: {},//student que activa el cambio para que no haya ciclo
    students_filter: [],//studiantes filtrados por grado
    schedule_select: '',
    data_graphics: [],//datos que se cargan para realizar los graficos y estadisticas
    data_reports: [],//datos que se cargan para realizar los  reportes
    isFetchingData: false,
    isFetchingDataReports: false
}

const studentReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_STUDENTS:
            return {
                ...state,
                isFetching: true
            }

        case FINISH_FETCH_STUDENTS:
            return {
                ...state,
                isFetching: false
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
                data_graphics: state.data_graphics.map(student =>
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
                isFetchingStudentByGrade: false
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
                student_full: action.payload.user,
                isFetchingStudent: false,
            }

        case START_FETCH_DATA_GRAPHICS:
            return {
                ...state,
                isFetchingData: true
            }

        case FINISH_FETCH_DATA_GRAPHICS:
            return {
                isFetchingData: false
            }

        case FETCH_DATA_GRAPHICS:
            return {
                ...state,
                data_graphics: action.payload.students,
                isFetchingData: false
            }

        case START_FETCH_STUDENT:
            return {
                ...state,
                isFetchingStudent: true
            }

        case FINISH_FETCH_STUDENT:
            return {
                ...state,
                isFetchingStudent: false
            }

        case START_FETCH_STUDENT_BY_GRADE:
            return {
                ...state,
                isFetchingStudentByGrade: true
            }

        case FINISH_FETCH_STUDENT_BY_GRADE:
            return {
                ...state,
                isFetchingStudentByGrade: false
            }

        case FETCH_DATA_REPORTS:
            return {
                ...state,
                data_reports: action.payload.students,
                isFetchingDataReports: false
            }

        case START_FETCH_DATA_REPORTS:
            return {
                ...state,
                isFetchingDataReports: true
            }

        case FINISH_FETCH_DATA_REPORTS:
            return {
                ...state,
                isFetchingDataReports: false
            }

        default:
            return state
    }
}

export default studentReducer