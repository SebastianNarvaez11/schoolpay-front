import { FETCH_GRADES, CREATE_GRADE, UPDATE_GRADE, DELETE_GRADE, SELECT_GRADE, RESET_GRADE } from '../actions/gradeActions'

const initialState = {
    grades: [],
    grade_select: {},
}

const gradeReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCH_GRADES:
            return {
                ...state,
                grades: action.payload.grades
            }

        case CREATE_GRADE:
            return {
                ...state,
                grades: [action.payload.grade, ...state.grades]
            }

        case UPDATE_GRADE:
            return {
                ...state,
                grades: state.grades.map(grade => grade.id === action.payload.grade.id ? (grade = action.payload.grade) : grade)
            }

        case DELETE_GRADE:
            return {
                ...state,
                grades: state.grades.filter(grade => grade.id !== action.payload.grade.id)
            }

        case SELECT_GRADE:
            return {
                ...state,
                grade_select: action.payload.grade
            }

        case RESET_GRADE:
            return {
                ...state,
                grade_select: {}
            }

        default:
            return state
    }
}
export default gradeReducer