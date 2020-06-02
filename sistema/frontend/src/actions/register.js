import axios from 'axios'
import { ADD_DELIVERYMAN, ADD_LOGISTICOPERATOR } from './types'


export const addDeliveryman = (deliveryman) => {
    return dispatch => {
        axios.post("api/deliveryman/", deliveryman)
            .then(res => {
                dispatch({
                    type: ADD_DELIVERYMAN,
                    payload: res.data
                })
            })
            .catch(err => console.log(err))
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
            .catch(err => console.log(err))
    }
}