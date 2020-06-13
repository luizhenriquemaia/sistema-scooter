import { GET_INTERNAL_MOVEMENTS, GET_EXTERNAL_MOVEMENTS, GET_MOVEMENTS, GET_MOVEMENT, DELETE_MOVEMENT, ADD_MOVEMENT, UPDATE_MOVEMENT } from '../actions/types.js'



const initialState = {
    movement: [],
    isDetails: false,
    isInternalMovement: false,
    isExternalMovement: false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_EXTERNAL_MOVEMENTS:
            return {
                ...state,
                movement: action.payload,
                isDetails: false,
                isInternalMovement: false,
                isExternalMovement: true
            }
        case GET_INTERNAL_MOVEMENTS:
            return {
                ...state,
                movement: action.payload,
                isDetails: false,
                isInternalMovement: true,
                isExternalMovement: false
            }
        case GET_MOVEMENTS:
            return {
                ...state,
                movement: action.payload,
                isDetails: false
            }
        case GET_MOVEMENT:
            return {
                ...state,
                movement: action.payload,
                isDetails: true
            }
        case DELETE_MOVEMENT:
            return {
                ...state,
                movement: state.movement.filter(movement => movement.id !== action.payload)
            }
        case ADD_MOVEMENT:
            return {
                ...state,
                movement: [...state.movement, action.payload]
            }
        case UPDATE_MOVEMENT:
            return {
                ...state,
                movement: action.payload
            }
        default:
            return state
    }
}