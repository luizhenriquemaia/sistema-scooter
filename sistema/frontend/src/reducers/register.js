import { ADD_DELIVERYMAN, ADD_LOGISTICOPERATOR } from '../actions/types.js'



const initialState = {
    register: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_DELIVERYMAN:
            return {
                ...state,
                register: [...state.register, action.payload]
            }
        case ADD_LOGISTICOPERATOR:
            return {
                ...state,
                register: [...state.register, action.payload]
            }
        default:
            return state
    }
}