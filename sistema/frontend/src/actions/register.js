import axios from 'axios'
import { ADD_DELIVERYMAN, ADD_LOGISTICOPERATOR } from './types'
import { returnErrors } from './messages'


export const addDeliveryman = (deliveryman) => {
    return dispatch => {
        axios.post("api/deliveryman/", deliveryman)
            .then(res => {
                dispatch({
                    type: ADD_DELIVERYMAN,
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
                    type: ADD_LOGISTICOPERATOR,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
    }
}