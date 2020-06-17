import axios from 'axios'
import { ADD_PEOPLE_REGISTRATION } from './types'
import { returnErrors, returnSuccess } from './messages'
import { tokenConfig } from './auth'


export const addPeopleRegistration = (person) => (dispatch, getState) => {
    axios.post("api/people-registration/", person, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_PEOPLE_REGISTRATION,
                payload: res.data.serializer
            })
            dispatch(returnSuccess(res.data.message, res.status))
        })
        .catch(err => dispatch(returnErrors(err.response.data.message, err.response.status)))
}