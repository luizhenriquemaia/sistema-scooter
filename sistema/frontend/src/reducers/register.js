import { ADD_DELIVERYMANT } from '../actions/types.js'



const initialState = {
    movement: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_DELIVERYMANT:
            return {
                ...state,
                movement: [...state.movement, action.payload]
            }
        default:
            return state
    }
}