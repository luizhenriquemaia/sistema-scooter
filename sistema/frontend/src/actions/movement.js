import axios from 'axios'
import { GET_INTERNAL_MOVEMENTS, GET_EXTERNAL_MOVEMENTS, GET_MOVEMENTS, GET_MOVEMENT, DELETE_MOVEMENT, ADD_MOVEMENT, UPDATE_MOVEMENT } from './types'
import { returnErrors } from './messages'


export const getMovements = (typeMovement) => {
    return dispatch => {
        axios.get(`/api/movement/?typeMovement=${typeMovement}`)
            .then(res => {
                dispatch({
                    type: (typeMovement === "entregas") ? GET_EXTERNAL_MOVEMENTS : GET_INTERNAL_MOVEMENTS,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
    }
}


export const getMovementsWithFilters = (filters, typeMovement) => {
    return dispatch => {
        axios.get(`/api/movement/?initialDate=${filters.filterInitialDate}&finalDate=${filters.filterFinalDate}&typeMovement=${typeMovement}`)
            .then(res => {
                dispatch({
                    type: GET_MOVEMENTS,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status))) 
    }
}


export function getMovement(id) {
    return dispatch => {
        axios.get(`/api/movement/${id}`)
            .then(res => {
                dispatch({
                    type: GET_MOVEMENT,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status))) 
    }
}


export const addMovement = (movement) => {
    return dispatch => {
        axios.post("api/movement/", movement)
            .then(res => {
                dispatch({
                    type: ADD_MOVEMENT,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status))) 
    }
}

export const updateMovement = (id, movementData) => {
    return dispatch => {
        axios.put(`/api/movement/${id}/`, movementData)
            .then(res => {
                dispatch({
                    type: UPDATE_MOVEMENT,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status))) 
    }
}


export const deleteMovement = (id) => {
    return dispatch => {
        axios.delete(`/api/movement/${id}/`)
            .then(res => {
                dispatch({
                    type: DELETE_MOVEMENT,
                    payload: id
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status))) 
    }
}