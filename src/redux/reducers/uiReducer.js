import { TOGGLE_SIDEBAR } from '../actions/uiActions'

const initialState = {
    sidebar: true
}


const uiReducer = (state = initialState, action) => {
    switch (action.type) {
        case TOGGLE_SIDEBAR:
            return {
                ...state,
                sidebar: !state.sidebar
            }
        default:
            return state
    }
}

export default uiReducer