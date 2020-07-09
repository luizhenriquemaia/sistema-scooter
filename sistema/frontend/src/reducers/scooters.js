import { GET_SCOOTERS, GET_STATUS_SCOOTERS, DELETE_SCOOTER, ADD_SCOOTER } from '../actions/types.js'



const initialState = {
    scooter: [],
    wasAdded: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SCOOTERS:
            return {
                ...state,
                scooter: action.payload,
                wasAdded: false
            }
        case GET_STATUS_SCOOTERS:
            return {
                ...state,
                statusScooter: action.payload,
                wasAdded: false
            }
        case DELETE_SCOOTER:
            return {
                ...state,
                scooter: state.scooter.filter(scooter => scooter.id !== action.payload),
                wasAdded: false
            }
        case ADD_SCOOTER:
            return {
                ...state,
                scooter: action.payload,
                wasAdded: true
            }
        default:
            return state
    }
}