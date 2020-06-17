import axios from 'axios'
import { returnErrors, returnSuccess } from './messages'
import { GET_LOGISTICS_OPERATORS, ADD_LOGISTIC_OPERATOR } from './types'
import { tokenConfig } from './auth'


export const getLogisticOperator = () => (dispatch, getState) => {
    axios.get(`/api/logistic-operator/`, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_LOGISTICS_OPERATORS,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}

export const addLogisticOperator = (LO) => (dispatch, getState) => {
    axios.post("api/logistic-operator/", LO, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_LOGISTIC_OPERATOR,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}