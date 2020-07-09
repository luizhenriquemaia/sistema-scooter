import { GET_LOGISTICS_OPERATORS, ADD_LOGISTIC_OPERATOR } from '../actions/types.js'



const initialState = {
    logisticOperator: [],
    wasAdded: false
}
 
export default function (state = initialState, action) {
    switch (action.type) {
        case GET_LOGISTICS_OPERATORS:
            return {
                ...state,
                logisticOperator: action.payload,
                wasAdded: false
            }
        case ADD_LOGISTIC_OPERATOR:
            return {
                ...state,
                logisticOperator: action.payload,
                wasAdded: true
            }
        default:
            return state
    }
}
