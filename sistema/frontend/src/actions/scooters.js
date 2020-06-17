import axios from 'axios'
import { GET_SCOOTERS, GET_SCOOTER, GET_STATUS_SCOOTERS, DELETE_SCOOTER, ADD_SCOOTER } from './types'
import { returnErrors, returnSuccess } from './messages'
import { tokenConfig } from './auth'


export const getScooters = () => (dispatch, getState) => {
    axios.get('/api/scooter/', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_SCOOTERS,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const getScooter = (id) => (dispatch, getState) => {
    axios.get(`/api/scooter/${id}`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_SCOOTER,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const getStatusScooters = () => (dispatch, getState) => {
    axios.get(`/api/status-scooter/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_STATUS_SCOOTERS,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const addScooter = (scooter) => (dispatch, getState) => {
    axios.post("api/scooter/", scooter, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_SCOOTER,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}


export const deleteScooter = (id) => (dispatch, getState) => {
    axios.delete(`/api/scooter/${id}/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: DELETE_SCOOTER,
                payload: id
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}