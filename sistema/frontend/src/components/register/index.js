import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addDeliveryman } from '../../actions/register'


export default function Register() {
    const dispatch = useDispatch()
    const [RegisterState, setRegisterState] = useState({
        registerType: "deliveryman",
        logisticOperatorDescription: "",
        deliverymanName: "",
        cpfDeliveryman: "",
        deliverymanActive: false
    })

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

    // const handleClick = (idRegister) => history.push(`details-register/${idRegister}`)
    const handleClickAdicionar = e => {
        const { registerType } = RegisterState
        if (registerType === "deliveryman") {
            const { deliverymanName, cpfDeliveryman, deliverymanActive } = RegisterState
            const cpfDeliverymanToAPI = cpfDeliveryman.replace(/\D/g, '')
            const newRegisterToAPI = { registerType, deliverymanName, deliverymanActive, cpfDeliverymanToAPI }
            console.log(newRegisterToAPI)
            dispatch(addDeliveryman(newRegisterToAPI))
        }
        else {
            const { logisticOperatorDescription } = RegisterState
            const newRegisterToAPI = { registerType, logisticOperatorDescription }
            console.log(newRegisterToAPI)
        }
        //dispatch(addRegister(newRegisterToAPI))
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
                    </select>
                    <label>Operador Logístico</label>
                    <input type="text" name="logisticOperatorDescription" onChange={handleChange} />
                    <label>CPF Entregador</label>
                    <input type="text" name="cpfDeliveryman" onChange={handleChange} />
                    <label>Nome Entregador</label>
                    <input type="text" name="deliverymanName" onChange={handleChange} />
                    <label>Ativo</label>
                    <input type="checkbox" name="deliverymanActive" onChange={handleCheck} />
                </div>
                <button className="submit-button" onClick={handleClickAdicionar}>Limpar</button>
                <button className="submit-button" onClick={handleClickAdicionar}>Registrar</button>
            </section>
        </main>
    )
}