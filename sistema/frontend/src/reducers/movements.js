import { GET_MOVEMENTS, GET_MOVEMENT, GET_TYPES_MOVEMENT, DELETE_MOVEMENT, ADD_MOVEMENT, UPDATE_MOVEMENT } from '../actions/types.js'



const initialState = {
    movement: [],
    isDetails: false,
    typesMovement: []
}

export default function (state = initialState, action) {
    switch (action.type) {
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
        case GET_TYPES_MOVEMENT:
            return {
                ...state,
                typesMovement: action.payload,
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