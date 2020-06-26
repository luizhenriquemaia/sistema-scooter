import axios from 'axios'
import { GET_MOVEMENTS, GET_MOVEMENT, GET_TYPES_MOVEMENT, DELETE_MOVEMENT, ADD_MOVEMENT, UPDATE_MOVEMENT } from './types'
import { returnErrors, returnSuccess } from './messages'
import { tokenConfig } from './auth'


export const getMovements = () => (dispatch, getState) => {
    axios.get(`/api/movement/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_MOVEMENTS,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const getMovementsWithFilters = (filters) => (dispatch, getState)  => {
    axios.get(`/api/movement/?initialDate=${filters.filterInitialDate}&finalDate=${filters.filterFinalDate}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_MOVEMENTS,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const getMovement = (id) => (dispatch, getState) => {
    axios.get(`/api/movement/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_MOVEMENT,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status))) 
}


export const getLastMovementsOfScooter = (chassis) => (dispatch, getState) => {
    axios.get(`/api/movement/?chassis=${chassis}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_MOVEMENT_BY_SCOOTER,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const getTypesMovement = () => (dispatch, getState) => {
    axios.get(`/api/type-movement/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_TYPES_MOVEMENT,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status))) 
}


export const postMovement = (movement) => (dispatch, getState) => {
    axios.post("api/movement/", movement, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_MOVEMENT,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status))) 
}

export const updateMovement = (id, movementData) => (dispatch, getState) => {
    axios.put(`/api/movement/${id}/`, movementData, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: UPDATE_MOVEMENT,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status))) 
}


export const deleteMovement = (id) => (dispatch, getState) => {
    axios.delete(`/api/movement/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_MOVEMENT,
                payload: id
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status))) 
}