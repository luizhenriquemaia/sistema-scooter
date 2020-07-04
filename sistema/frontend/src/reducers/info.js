import { GET_ERRORS, GET_SUCCESS, RESET_MESSAGE } from '../actions/types'


const initialState = {
    msg: "",
    status: null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_SUCCESS:
        case GET_ERRORS:
            return {
                msg: action.payload.msg,
                status: action.payload.status
            }
        case RESET_MESSAGE:
            return {
                ...initialState
            }
        default:
            return state
    }
}