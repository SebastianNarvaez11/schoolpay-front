import { FETCH_PAYMENTS, START_FETCH_PAYMENTS, FINISH_FETCH_PAYMENTS, CREATE_PAYMENT, START_FETCH_COMPROMISES, FINISH_FETCH_COMPROMISES, FETCH_COMPROMISES, CREATE_COMPROMISE } from '../actions/paymentActions'

const initialState = {
    payments: [],
    isFetchingPayments: false,
    compromises: [],
    isFetchingCompromises: false
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
                isFetchingPayments: false
            }

        case CREATE_PAYMENT:
            return {
                ...state,
                payments: [action.payload.payment, ...state.payments],
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

        // case DELETE_USER:
        //     return {
        //         ...state,
        //         users: state.users.filter(user => user.id !== action.payload.user.id)
        //     }


        default:
            return state
    }
}

export default paymentReducer