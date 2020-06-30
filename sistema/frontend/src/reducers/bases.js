import { GET_BASES_OF_WORK } from '../actions/types'


const initialState = {
    base: []
}


export default function (state = initialState, action) {
    switch (action.type) {
        case GET_BASES_OF_WORK:
            return {
                ...state,
                base: action.payload
            }
        default:
            return state
    }
}