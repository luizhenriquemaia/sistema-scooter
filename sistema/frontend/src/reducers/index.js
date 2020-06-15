import { combineReducers } from 'redux'
import scooters from './scooters'
import logisticOperator from './logisiticOperator'
import movements from './movements'
import peopleRegistration from './peopleRegistration'
import errors from './errors'
import messages from './messages'
import auth from './auth'


export default combineReducers({
    scooters,
    logisticOperator,
    movements,
    peopleRegistration,
    errors,
    messages,
    auth,
})