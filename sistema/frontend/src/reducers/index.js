import { combineReducers } from 'redux'
import scooters from './scooters'
import movements from './movements'
import registers from './register'
import errors from './errors'
import messages from './messages'


export default combineReducers({
    scooters,
    movements,
    registers,
    messages,
    errors,
})