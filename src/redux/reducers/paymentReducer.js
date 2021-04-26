import {
    FETCH_PAYMENTS,
    START_CREATE_PAYMENT_MANUAL,
    FINISH_CREATE_PAYMENT_MANUAL,
    START_FETCH_PAYMENTS,
    FINISH_FETCH_PAYMENTS,
    CREATE_PAYMENT,
    START_FETCH_COMPROMISES,
    FINISH_FETCH_COMPROMISES,
    FETCH_COMPROMISES,
    CREATE_COMPROMISE,
    DELETE_COMPROMISE,
    UPDATE_COMPROMISE_SINCE_LIST,
    START_FETCH_STUDENT_COMPROMISE,
    FINISH_FETCH_STUDENT_COMPROMISE,
    GET_STUDENT_FULL,
    RESET_STUDENT_FULL,
    START_FETCH_PAYMENTS_BY_PERIOD,
    FINISH_FETCH_PAYMENTS_BY_PERIOD
} from '../actions/paymentActions'

const initialState = {
    payments: [],
    isFetchingPayments: false,
    isFetchingPaymentsByPeriod: false,
    compromises: [],
    studentFull: {},
    isFetchingCompromises: false,
    isFetchingStudentFull: false,
    isCreatingPayment: false
}

const paymentReducer = (state = initialState, action) => {
    switch (action.type) {

        case START_FETCH_PAYMENTS:
            return {
                ...state,
                isFetchingPayments: true
            }

        case FINISH_FETCH_PAYMENTS:
            return {
                ...state,
                isFetchingPayments: false
            }

        case FETCH_PAYMENTS:
            return {
                ...state,
                payments: action.payload.payments,
                isFetchingPayments: false,
                isFetchingPaymentsByPeriod: false,
            }

        case START_CREATE_PAYMENT_MANUAL:
            return {
                ...state,
                isCreatingPayment: true
            }

        case FINISH_CREATE_PAYMENT_MANUAL:
            return {
                ...state,
                isCreatingPayment: false
            }

        case CREATE_PAYMENT:
            return {
                ...state,
                payments: [action.payload.payment, ...state.payments],
                isCreatingPayment: false
            }

        case START_FETCH_COMPROMISES:
            return {
                ...state,
                isFetchingCompromises: true
            }

        case FINISH_FETCH_COMPROMISES:
            return {
                ...state,
                isFetchingCompromises: false
            }

        case FETCH_COMPROMISES:
            return {
                ...state,
                compromises: action.payload.compromises,
                isFetchingCompromises: false
            }

        case CREATE_COMPROMISE:
            return {
                ...state,
                compromises: [action.payload.compromise, ...state.compromises],
            }

        case UPDATE_COMPROMISE_SINCE_LIST:
            return {
                ...state,
                compromises: state.compromises.map(compromise => compromise.id === action.payload.compromise.id ? (compromise = action.payload.compromise) : compromise)
            }

        case DELETE_COMPROMISE:
            return {
                ...state,
                compromises: state.compromises.filter(compromise => compromise.id !== action.payload.compromise)
            }

        case GET_STUDENT_FULL:
            return {
                ...state,
                studentFull: action.payload.user,
                isFetchingStudentFull: false
            }

        case START_FETCH_STUDENT_COMPROMISE:
            return {
                ...state,
                isFetchingStudentFull: true
            }

        case FINISH_FETCH_STUDENT_COMPROMISE:
            return {
                ...state,
                isFetchingStudentFull: false
            }

        case RESET_STUDENT_FULL:
            return {
                ...state,
                studentFull: {}
            }

        case START_FETCH_PAYMENTS_BY_PERIOD:
            return {
                ...state,
                isFetchingPaymentsByPeriod: true
            }

        case FINISH_FETCH_PAYMENTS_BY_PERIOD:
            return {
                ...state,
                isFetchingPaymentsByPeriod: false
            }


        default:
            return state
    }
}

export default paymentReducer