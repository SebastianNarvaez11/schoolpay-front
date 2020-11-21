import { SENDING, SENT } from '../actions/contactAction'

const initialState = {
    sending: false,
}

const contactReducer = (state = initialState, action) => {
    switch (action.type) {

        case SENDING:
            return {
                ...state,
                sending: true
            }

        case SENT:
            return {
                ...state,
                sending: false
            }

        default:
            return state
    }
}

export default contactReducer