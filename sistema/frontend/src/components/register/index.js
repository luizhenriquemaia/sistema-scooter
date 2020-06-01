import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { useHistory } from 'react-router-dom'
// import { getMovement, addMovement } from '../../actions/movement'


export default function Register() {
    const dispatch = useDispatch()
    // const history = useHistory()
    const registers = useSelector(state => state.registers.register)
    const [RegisterState, setRegisterState] = useState([{
        registerType: "",
        logisticOperator: {
            description: ""},
        deliveryman: {
            name: ""},
        cpfDeliveryman: ""
    }])
    
    useEffect(() => {
        if (registers.length !== 0) setRegisterState(registers)
    }, [registers])

    useEffect(() => {
        dispatch(getRegisters())
    }, [])

    const handleChange = e => {
        const { name, value } = e.target
        setNewRegisterState({
            ...newRegisterState,
            [name]: value
        })
    }

    // const handleCheck = e => {
    //     const { name, checked } = e.target
    //     setNewRegisterState({
    //         ...newRegisterState,
    //         [name]: checked
    //     })
    // }

    // const handleClick = (idRegister) => history.push(`details-register/${idRegister}`)
    // const handleClickAdicionar = e => {
    //     const { scooter, OL, cpfDeliverymanState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newRegisterState
    //     const cpfDeliveryman = cpfDeliverymanState.replace(/\D/g, '')
    //     const typeRegister = "retirada"
    //     const newRegisterToAPI = { scooter, OL, cpfDeliveryman, typeRegister, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
    //     dispatch(addRegister(newRegisterToAPI))
    // }

    // console.log(RegisterState)


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
                    <input type="text" name="OL" onChange={handleChange} />
                    <label>CPF Entregador</label>
                    <input type="text" name="cpfDeliverymanState" onChange={handleChange} />  {/* não seria apenas name=cpfDeliveryman" */}
                </div>
                <button className="submit-button" onClick={handleClickAdicionar}>Limpar</button>
                <button className="submit-button" onClick={handleClickAdicionar}>Registrar</button>
            </section>
        </main>
    )
}