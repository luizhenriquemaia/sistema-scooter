import { combineReducers } from 'redux'
import scooters from './scooters'
import movements from './movements'
import register from './register'
import errors from './errors'


export default combineReducers({
    scooters,
    movements,
    register,
    errors,
})