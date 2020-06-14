import axios from 'axios'
import { ADD_PEOPLE_REGISTRATION } from './types'
import { returnErrors } from './messages'


export const addPeopleRegistration = (person) => {
    return dispatch => {
        axios.post("api/people-registration/", person)
            .then(res => {
                dispatch({
                    type: ADD_PEOPLE_REGISTRATION,
                    payload: res.data
                })
            })
            .catch(err => dispatch(returnErrors(err.response.data, err.response.status)))
    }
}