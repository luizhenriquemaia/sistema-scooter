import { combineReducers } from 'redux'
import scooters from './scooters'
import logisticOperator from './logisiticOperator'
import movements from './movements'
import peopleRegistration from './peopleRegistration'
import errors from './errors'
import messages from './messages'


export default combineReducers({
    scooters,
    logisticOperator,
    movements,
    peopleRegistration,
    messages,
    errors,
})