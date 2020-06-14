import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { postMovement } from '../../actions/movement'
import { getLogisticOperator } from '../../actions/logisticOperator'


export default function addMovementComponent() {
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
    const [typeOfMovementSelect, setTypeOfMovementSelect] = useState("Interna")

    useEffect(() => {
        dispatch(getLogisticOperator())
    }, [])

    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)

   useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])


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

    const handleClean = e => {
        setRegisterState({
            ...RegisterState,
            scooter: "",
            cpfPeopleRegistrationState: "",
            logisticOperator: "",
            accessoriesHelmet: false,
            accessoriesBag: false,
            accessoriesCase: false,
            accessoriesCharger: false,
            observation: ""
        })
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
        else if (scooter === "" || logisticOperator === "") {
            alert.error("preencha todos os campos obrigatórios")
        }
        else {
            var logisticOperator_id = logisticOperatorFromAPI
            var typeOfMovement = typeOfMovementSelect
            var newMovementToAPI = { typeOfMovement, logisticOperator_id, scooter, cpfPeopleRegistrationState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
            dispatch(postMovement(newMovementToAPI))
            setNewMovementState({
                scooter: "",
                cpfPeopleRegistrationState: "",
                logisticOperator: "",
                accessoriesHelmet: false,
                accessoriesBag: false,
                accessoriesCase: false,
                accessoriesCharger: false,
                observation: ""
            })
        }
    }

    return (
        <main className="content">
            <section className="section-box movement-section">
                <div className="title-box">
                    <h1 className="title-page">Adicionar Movimentação</h1>
                </div>
                <section className="content-box">
                    <fieldset className="moevemt-data-box">
                        <label>Tipo de Movimentação</label>
                        <select name="typeOfMovement" onChange={handleChange} >
                            <option value="Interna">Interna</option>
                            <option value="Externa">Externa</option>
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
                    </fieldset>
                    <div className="buttonBox">
                        <button className="submit-button clean" onClick={handleClean}>Limpar</button>
                        <button className="submit-button confirm" onClick={handleClickAdd}>Registrar</button>
                    </div>
                </section>
            </section>
        </main>
    )
}