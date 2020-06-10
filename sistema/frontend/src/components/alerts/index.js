import React, { useState, useEffect, Fragment } from 'react'
import { useSelector } from 'react-redux'
import { useAlert } from 'react-alert'



export default function Alerts() {
    const alert = useAlert()
    const errorMessage = useSelector(state => state.errors.msg)
    const errorStatus = useSelector(state => state.errors.status)
    const [messageState, setMessageState] = useState("")

    
    useEffect(() => {
        if (errorMessage) {
            setMessageState(errorMessage)
        }
    }, [errorMessage])

    useEffect(() => {
        if (messageState) {
            if (errorStatus >= 400 && errorStatus < 500 ) {
                alert.error(messageState)
            }
            if (errorStatus >= 200 && errorStatus < 400) {
                alert.success(messageState)
            }
        }
    }, [messageState])


    return <Fragment />
}