import {FETCH_ADMIN_USERS, CREATE_ADMIN, UPDATE_ADMIN, DELETE_USER} from '../actions/adminActions'

const initialState = {
    users: [],//usuarios de tipo admin
}

const AdminReducer = (state = initialState, action) => {
    switch (action.type) {

        case FETCH_ADMIN_USERS:
            return {
                ...state,
                users: action.payload.users,
            }

        case CREATE_ADMIN:
            return {
                ...state,
                users: [action.payload.user, ...state.users],
            }

        case UPDATE_ADMIN:
            return {
                ...state,
                users: state.users.map(user =>
                    user.id === action.payload.user.id ? (user = action.payload.user) : user)
            }

        case DELETE_USER:
            return {
                ...state,
                users: state.users.filter(user => user.id !== action.payload.user.id)
            }

        default:
            return state
    }
}

export default AdminReducer