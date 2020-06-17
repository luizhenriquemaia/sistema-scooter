import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useAlert } from 'react-alert'
import { resetMessages } from '../../actions/messages'



export default function Alerts() {
    const alert = useAlert()
    const dispatch = useDispatch()
    const errorMessage = useSelector(state => state.info.msg)
    const errorStatus = useSelector(state => state.info.status)
    const [messageState, setMessageState] = useState("")
    const [shouldResetMessage, setShouldResetMessage] = useState(false)

    
    useEffect(() => {
        console.log(3)
        if (messageState === "" && shouldResetMessage === false) {
            if (errorMessage) {
                setMessageState(errorMessage)
            }
        }
    }, [errorMessage])

    useEffect(() => {
        if (shouldResetMessage === true) {
            dispatch(resetMessages())
            setMessageState("")
            setShouldResetMessage(false)
        }
    }, [shouldResetMessage])


    useEffect(() => {
        if (messageState) {
            console.log(55)
            if (messageState.detail) {
                // if (errorStatus >= 500) {
                //     alert.error("Erro interno do servidor")
                // }
                // if (errorStatus >= 400 && errorStatus < 500) {
                //     alert.error(messageState.detail)
                // }
                // if (errorStatus >= 200 && errorStatus < 400) {
                //     alert.success(messageState.detail)
                // }
            }
            else if (messageState.logisticOperator_id) {
                if (errorStatus >= 500) {
                    alert.error("Erro interno do servidor")
                }
                if (errorStatus >= 400 && errorStatus < 500) {
                    alert.error("Bad Request")
                }
            }
            else if (messageState.non_field_errors) {
                if (errorStatus >= 500) {
                    alert.error("Erro interno do servidor")
                }
                if (errorStatus >= 400 && errorStatus < 500) {
                    alert.error(messageState.non_field_errors)
                }
                if (errorStatus >= 200 && errorStatus < 400) {
                    alert.success(messageState.non_field_errors)
                }
            }
            else {
                if (errorStatus >= 500) {
                    alert.error("Erro interno do servidor")
                }
                if (errorStatus >= 400 && errorStatus < 500) {
                    alert.error(messageState)
                }
                if (errorStatus >= 200 && errorStatus < 400) {
                    if (messageState) {
                        alert.success(messageState)
                    }                    
                }
            }
            setShouldResetMessage(true)
        }
    }, [messageState])


    return <Fragment />
}