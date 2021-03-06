import axios from 'axios'
import { returnErrors, returnSuccess } from './messages'
import { USER_LOADING, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, ADD_EMPLOYEE } from './types'


export const loadUser = () => (dispatch, getState) => {
    dispatch({ type: USER_LOADING })
    axios.get('/api/auth/user', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: USER_LOADED,
                payload: res.data
            })
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: AUTH_ERROR
            })
        })
}


export const loginUser = (username, password) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const requestBody = JSON.stringify({ username, password })
    axios.post('/api/auth/login', requestBody, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            })
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
            dispatch({
                type: LOGIN_FAIL
            })
        })
}

export const logoutUser = () => (dispatch, getState) => {
    
    axios.post('/api/auth/logout', null, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: LOGOUT_SUCCESS
            })
        }).catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status))
        })
}


export const addEmployee = (employee) => (dispatch, getState) => {
    axios.post("api/auth/employee/", employee, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_EMPLOYEE,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const tokenConfig = getState => {
    const token = getState().auth.token
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if (token) {
        config.headers['Authorization'] = `Token ${token}`
    }
    return config
}