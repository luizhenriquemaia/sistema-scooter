import axios from 'axios'
import { returnErrors } from './messages'
import { GET_LOGISTICS_OPERATORS, ADD_LOGISTIC_OPERATOR } from './types'


export function getLogisticOperator() {
    return dispatch => {
        axios.get(`/api/logistic-operator/`)
            .then(res => {
                dispatch({
                    type: GET_LOGISTICS_OPERATORS,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
    }
}

export const addLogisticOperator = (LO) => {
    return dispatch => {
        axios.post("api/logistic-operator/", LO)
            .then(res => {
                dispatch({
                    type: ADD_LOGISTIC_OPERATOR,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
    }
}