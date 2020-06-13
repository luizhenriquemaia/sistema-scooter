import { GET_LOGISTICS_OPERATORS, ADD_LOGISTIC_OPERATOR } from '../actions/types.js'



const initialState = {
    logisticOperator: []
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LOGISTICS_OPERATORS:
            return {
                ...state,
                logisticOperator: action.payload,
            }
        case ADD_LOGISTIC_OPERATOR:
            return {
                ...state,
                logisticOperator: [...state.logisticOperator, action.payload]
            }
        default:
            return state
    }
}
