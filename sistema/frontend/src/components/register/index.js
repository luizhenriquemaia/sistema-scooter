import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addDeliveryman, addLogisticOperator } from '../../actions/register'
import { getStatusScooters, addScooter } from '../../actions/scooters'


export default function Register() {
    const dispatch = useDispatch()
    const [RegisterState, setRegisterState] = useState({
        registerType: "deliveryman",
        logisticOperatorDescription: "",
        deliverymanName: "",
        cpfDeliveryman: "",
        deliverymanActive: false,
        chassisScooter: "",
        statusScooter: ""
    })
    const [statusScooterFromAPI, setStatusScooterFromAPI] = useState([{
        id: "",
        description: ""
    }])

    useEffect(() => {
        dispatch(getStatusScooters())
    }, [])

    const statusScooter = useSelector(state => state.scooters.statusScooter)

    useEffect(() => {
        if (statusScooter !== undefined && statusScooter !== "") {
            setStatusScooterFromAPI(statusScooter)
        }
    }, [statusScooter])

    const handleChange = e => {
        const { name, value } = e.target
        setRegisterState({
            ...RegisterState,
            [name]: value
        })
    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setRegisterState({
            ...RegisterState,
            [name]: checked
        })
    }

    console.log(RegisterState)

    const handleClickAdicionar = e => {
        const { registerType } = RegisterState
        if (registerType === "deliveryman") {
                const { deliverymanName, cpfDeliveryman, deliverymanActive } = RegisterState
                const cpfDeliverymanToAPI = cpfDeliveryman.replace(/\D/g, '')
                if (cpfDeliverymanToAPI.length !== 11) {
                    console.log("cpf inválido")
                }
                else {
                    var newRegisterToAPI = { deliverymanName, deliverymanActive, cpfDeliverymanToAPI }
                    console.log(newRegisterToAPI)
                    dispatch(addDeliveryman(newRegisterToAPI))
                    setRegisterState({registerType: "deliveryman", deliverymanName: "", cpfDeliveryman: "", deliverymanActive: false})
                }
            }
        else if (registerType === "logisticOperator") {
                const { logisticOperatorDescription } = RegisterState
                var newRegisterToAPI = { registerType, logisticOperatorDescription }
                console.log(newRegisterToAPI)
                dispatch(addLogisticOperator(newRegisterToAPI))
                setRegisterState({registerType: "logisticOperator", logisticOperatorDescription: ""})
            }
        else if (registerType === "scooter") {
                    const { chassisScooter, statusScooter } = RegisterState
                    if (statusScooter !== "0" && statusScooter !== "") {
                        var newRegisterToAPI = { chassisScooter, statusScooter }
                        console.log(newRegisterToAPI)
                        dispatch(addScooter(newRegisterToAPI))
                        setRegisterState({registerType: "scooter", chassisScooter: "", statusScooter: ""})
                    }
                    else {
                        console.log("invalid status scooter")
                    }
                }
        else {
            console.log("invalid register type")
        }
    }


    return (
        <main className="content">
            <h1 className="title-page">Cadastros</h1>
            <section className="registers-section">
                <div className="registers-content">
                    <label>Tipo de cadastro</label>
                    <select name="registerType" onChange={handleChange} >
                        <option value="deliveryman">Entregador</option>
                        <option value="logisticOperator">Operador Oligstico</option>
                        <option value="scooter">Patinete</option>
                    </select>
                    <label>Operador Logístico</label>
                    <input type="text" name="logisticOperatorDescription" value={RegisterState.logisticOperatorDescription || ''} onChange={handleChange} />
                    <label>CPF Entregador</label>
                    <input type="text" name="cpfDeliveryman" value={RegisterState.cpfDeliveryman || ''} onChange={handleChange} />
                    <label>Nome Entregador</label>
                    <input type="text" name="deliverymanName" value={RegisterState.deliverymanName || ''} onChange={handleChange} />
                    <label>Ativo</label>
                    <input type="checkbox" name="deliverymanActive" value={RegisterState.deliverymanActive || ''} onChange={handleCheck} />
                    <label>Chassi Patinete</label>
                    <input type="text" name="chassisScooter" value={RegisterState.chassisScooter || ''} onChange={handleChange} />
                    <label>Status Patinete</label>
                    <select name="statusScooter" onChange={handleChange} >
                        <option value="0">-----</option>
                        {statusScooterFromAPI.map(status => (
                            <option value={status.id} key={status.id}>{status.description}</option>
                        ))}
                    </select>
                    
                </div>
                <button className="submit-button" onClick={handleClickAdicionar}>Limpar</button>
                <button className="submit-button" onClick={handleClickAdicionar}>Registrar</button>
            </section>
        </main>
    )
}