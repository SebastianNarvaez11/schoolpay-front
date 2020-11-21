import { combineReducers } from 'redux'
import uiReducer from './uiReducer'
import authReducer from './authReducer'
import adminReducer from './adminReducer'
import paymentReducer from './paymentReducer'
import studentReducer from './studentReducer'
import gradeReducer from './gradeReducer'
import contactReducer from './contactReducer'


const rootReducer = combineReducers({
    uiReducer, authReducer, adminReducer, paymentReducer, studentReducer, gradeReducer, contactReducer
})

export default rootReducer