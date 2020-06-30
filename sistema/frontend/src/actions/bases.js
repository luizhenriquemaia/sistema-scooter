import axios from 'axios'
import { returnErrors, returnSuccess } from './messages'
import { GET_BASES_OF_WORK } from './types'
import { tokenConfig } from './auth'


export const getBases = () => (dispatch, getState) => {
    axios.get('/api/bases-of-work', tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_BASES_OF_WORK,
                payload: res.data.serializer
            })
            dispatch(returnSuccess("", res.status))
        }).catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}