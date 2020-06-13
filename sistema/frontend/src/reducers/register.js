import { ADD_PEOPLE_REGISTRATION, ADD_LOGISTICOPERATOR } from '../actions/types.js'



const initialState = {
    register: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ADD_PEOPLE_REGISTRATION:
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