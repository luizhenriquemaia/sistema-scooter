import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { getTypesMovement } from '../../actions/movement'
import { getLogisticOperator } from '../../actions/logisticOperator'



export default function addMovement() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [newMovementState, setNewMovementState] = useState({
        scooter: "",
        cpfPeopleRegistrationState: "",
        logisticOperator: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    })
    const [logisticOperatorFromAPI, setLogisticOperatorFromAPI] = useState([{
        id: "",
        description: ""
    }])
    const [typeOfMovementSelect, setTypeOfMovementSelect] = useState([{
        id: "",
        description: ""
    }])

    useEffect(() => {
        dispatch(getLogisticOperator())
        dispatch(getTypesMovement())
    }, [])

    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)
    const typesMovement = useSelector(state => state.movements.typesMovement)

   useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])

    useEffect(() => {
        if (typesMovement !== undefined && typesMovement !== "") {
            setTypeOfMovementSelect(typesMovement)
        }
    }, [typesMovement])

    const handleChange = e => {
        const { name, value } = e.target
        if (name === "typeOfMovement") {
            setTypeOfMovementSelect(value)
        }
        else {
            setNewMovementState({
                ...newMovementState,
                [name]: value
            })
        }

    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setNewMovementState({
            ...newMovementState,
            [name]: checked
        })
    }

    const handleClickAdd = e => {
        const { scooter, cpfPeopleRegistrationState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        const cpfPeopleRegistration = cpfPeopleRegistrationState.replace(/\D/g, '')
        if (cpfPeopleRegistration.length !== 11) {
            alert.error("cpf inválido")
        }
        else {
            const typeRelease = "retirada"
            const typeMovement = "entregas"
            const newMovementToAPI = { scooter, cpfPeopleRegistration, typeMovement, typeRelease, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
            dispatch(addMovement(newMovementToAPI))
        }
        setNewMovementState({ scooter: "", cpfPeopleRegistrationState: "", accessoriesHelmet: false, accessoriesBag: false, accessoriesCase: false, accessoriesCharger: false, observation: "" })
    }

    return (
        <div className="content">
            <h1 className="title-page">Adicionar Movimentação</h1>
            <label>Tipo de Movimentação</label>
            <select name="typeOfMovement" onChange={setTypeOfMovementSelect} >
                {typeOfMovementSelect.map(typeMovement => (
                    <option value={typeMovement.id} key={typeMovement.id}>{typeMovement.description}</option>
                ))}
            </select>
            <label>Scooter</label>
            <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
            <label>CPF Entregador</label>
            <input type="text" name="cpfPeopleRegistrationState" value={newMovementState.cpfPeopleRegistrationState} onChange={handleChange} />
            <label>OL</label>
            <select name="logisticOperator" onChange={handleChange}>
                <option value="">-----</option>
                {logisticOperatorFromAPI.map(logisitcOperator => (
                    <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                ))}
            </select>
            <label>Capacete</label>
            <input type="checkbox" name="accessoriesHelmet" checked={newMovementState.accessoriesHelmet} onChange={handleCheck} />
            <label>Bag</label>
            <input type="checkbox" name="accessoriesBag" checked={newMovementState.accessoriesBag} onChange={handleCheck} />
            <label>Case</label>
            <input type="checkbox" name="accessoriesCase" checked={newMovementState.accessoriesCase} onChange={handleCheck} />
            <label>Carregador</label>
            <input type="checkbox" name="accessoriesCharger" checked={newMovementState.accessoriesCharger} onChange={handleCheck} />
            <label>Observação</label>
            <textarea name="observation" value={newMovementState.observation} onChange={handleChange}></textarea>
            <button className="submit-button" onClick={handleClickAdd}>Adicionar</button>
        </div>
    )
}