import { CREATE_MESSAGE, GET_ERRORS, GET_SUCCESS, RESET_MESSAGE } from './types'


export const createMessage = msg => {
    return {
        type: CREATE_MESSAGE,
        payload: msg
    }
}

export const returnErrors = (msg, status) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status }
    }
}

export const returnSuccess = (msg, status) => {
    return {
        type: GET_SUCCESS,
        payload: { msg, status }
    }
}

export const resetMessages = () => {
    return {
        type: RESET_MESSAGE,
        payload: ""
    }
}