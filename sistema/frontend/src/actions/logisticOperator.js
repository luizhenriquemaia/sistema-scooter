import axios from 'axios'
import { returnErrors } from './messages'
import { GET_LOGISTICS_OPERATORS, ADD_LOGISTIC_OPERATOR } from './types'
import { tokenConfig } from './auth'


export const getLogisticOperator = () => (dispatch, getState) => {
    axios.get(`/api/logistic-operator/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_LOGISTICS_OPERATORS,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}

export const addLogisticOperator = (LO) => (dispatch, getState) => {
    axios.post("api/logistic-operator/", LO, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_LOGISTIC_OPERATOR,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}