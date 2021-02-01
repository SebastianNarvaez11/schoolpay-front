import { FETCH_PAYMENTS, START_FETCH_PAYMENTS, FINISH_FETCH_PAYMENTS} from '../actions/paymentActions'

const initialState = {
    payments: [],
    isFetchingPayments: false
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

        // case CREATE_PAYMENT:
        //     return {
        //         ...state,
        //         payments: [action.payload.user, ...state.users],
        //     }

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