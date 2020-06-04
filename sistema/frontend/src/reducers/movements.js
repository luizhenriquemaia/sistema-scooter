import { GET_MOVEMENTS, GET_MOVEMENT, DELETE_MOVEMENT, ADD_MOVEMENT, UPDATE_MOVEMENT } from '../actions/types.js'



const initialState = {
    movement: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_MOVEMENTS:
            return {
                ...state,
                movement: action.payload,
            }
        case GET_MOVEMENT:
            return {
                ...state,
                movement: action.payload,
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