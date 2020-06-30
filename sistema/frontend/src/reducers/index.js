import { combineReducers } from 'redux'
import scooters from './scooters'
import logisticOperator from './logisiticOperator'
import movements from './movements'
import peopleRegistration from './peopleRegistration'
import info from './info'
import messages from './messages'
import auth from './auth'
import bases from './bases'


export default combineReducers({
    scooters,
    logisticOperator,
    movements,
    peopleRegistration,
    bases,
    info,
    messages,
    auth,
})