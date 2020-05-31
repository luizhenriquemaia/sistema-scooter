import { combineReducers } from 'redux'
import scooters from './scooters'
import movement from './movement'
import errors from './errors'


export default combineReducers({
    scooters,
    movement,
    errors,
})