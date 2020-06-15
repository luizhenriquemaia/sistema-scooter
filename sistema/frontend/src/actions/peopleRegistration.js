import axios from 'axios'
import { ADD_PEOPLE_REGISTRATION } from './types'
import { returnErrors } from './messages'
import { tokenConfig } from './auth'


export const addPeopleRegistration = (person) => (dispatch, getState) => {
    axios.post("api/people-registration/", person, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: ADD_PEOPLE_REGISTRATION,
                payload: res.data
            })
        })
        .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
}