import axios from 'axios'
import { ADD_DELIVERYMAN } from './types'


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