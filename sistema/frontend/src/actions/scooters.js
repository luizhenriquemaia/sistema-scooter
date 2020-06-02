import axios from 'axios'
import { GET_SCOOTERS, GET_SCOOTER, GET_STATUS_SCOOTERS, DELETE_SCOOTER, ADD_SCOOTER } from './types'


export function getScooters() {
    return dispatch => {
        axios.get('/api/scooter/')
            .then(res => {
                dispatch({
                    type: GET_SCOOTERS,
                    payload: res.data
                })
            })
            .catch(
                err => dispatch(returnErrors(err.response.data, err.response.status))
            )
    }
}


export function getScooter(id) {
    return dispatch => {
        axios.get(`/api/scooter/${id}`)
            .then(res => {
                dispatch({
                    type: GET_SCOOTER,
                    payload: res.data
                })
            })
            .catch(
                err => dispatch(returnErrors(err.response.data, err.response.status))
            )
    }
}


export function getStatusScooters() {
    return dispatch => {
        axios.get(`/api/status-scooter/`)
            .then(res => {
                dispatch({
                    type: GET_STATUS_SCOOTERS,
                    payload: res.data
                })
            })
            .catch(
                err => dispatch(returnErrors(err.response.data, err.response.status))
            )
    }
}


export const addScooter = (scooter) => {
    return dispatch => {
        axios.post("api/scooter/", scooter)
            .then(res => {
                dispatch({
                    type: ADD_SCOOTER,
                    payload: res.data
                })
            })
            .catch(err => console.log(err))
    }
}


export const deleteScooter = (id) => {
    return dispatch => {
        axios.delete(`/api/scooter/${id}/`)
            .then(res => {
                dispatch({
                    type: DELETE_SCOOTER,
                    payload: id
                })
            })
            .catch(err => console.log(err))
    }
}