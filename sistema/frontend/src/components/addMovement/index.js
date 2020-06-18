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
        logisticOperatorMovement: "",
        cpfPeopleRegistrationState: "",
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
    const [destinyScooterInternalMovement, setDestinyScooterInternalMovement] = useState("maintenance")

    useEffect(() => {
        dispatch(getLogisticOperator())
    }, [])

    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)

    useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])
    
    const [typeOfMovementSelect, setTypeOfMovementSelect] = useState("external")

    const handleChange = e => {
        const { name, value } = e.target
        if (name === "typeOfMovement") {
            setTypeOfMovementSelect(value)
        }
        else if (name === "destinyScooterInternalMovement") {
            setDestinyScooterInternalMovement(value)
        }
        else {
            setNewMovementState({
                ...newMovementState,
                [name]: value
            })
        }
    }

    const handleClean = e => {
        setNewMovementState({
            ...newMovementState,
            scooter: "",
            cpfPeopleRegistrationState: "",
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
        const { scooter, cpfPeopleRegistrationState, logisticOperatorMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        const cpfPeopleRegistration = cpfPeopleRegistrationState.replace(/\D/g, '')
        var typeOfMovement = typeOfMovementSelect
        if (typeOfMovement === "external") {
            if (scooter === "" || cpfPeopleRegistration === "") {
                alert.error("preencha todos os campos obrigatórios")
            }
            else if (cpfPeopleRegistration !== "" && cpfPeopleRegistration.length !== 11) {
                alert.error("cpf inválido")
            }
            else {
                var newMovementToAPI = { typeOfMovement, scooter, cpfPeopleRegistrationState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
                dispatch(postMovement(newMovementToAPI))
                setNewMovementState({
                    ...newMovementState,
                    scooter: "",
                    cpfPeopleRegistrationState: "",
                    accessoriesHelmet: false,
                    accessoriesBag: false,
                    accessoriesCase: false,
                    accessoriesCharger: false,
                    observation: ""
                })
            }
        }
        else if (typeOfMovement === "internal") {
            if (scooter === "") {
                alert.error("preencha todos os campos obrigatórios")
            }
            else {
                var destinyScooterToAPI = destinyScooterInternalMovement
                var newMovementToAPI = { typeOfMovement, destinyScooterToAPI, scooter, logisticOperatorMovement, cpfPeopleRegistrationState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
                dispatch(postMovement(newMovementToAPI))
                setNewMovementState({
                    ...newMovementState,
                    scooter: "",
                    cpfPeopleRegistrationState: "",
                    accessoriesHelmet: false,
                    accessoriesBag: false,
                    accessoriesCase: false,
                    accessoriesCharger: false,
                    observation: ""
                })
            }
        }
    }

    return (
        <main className="content">
            <section className="section-main-box add-movement-section">
                <div className="title-box">
                    <h1 className="title-page">Adicionar Movimentação</h1>
                </div>
                <section className="content-box">
                    <div className="register-type">
                        <label>Tipo de Movimentação</label>
                        <select name="typeOfMovement" onChange={handleChange} >
                            <option value="external">Externa</option>
                            <option value="internal">Interna</option>
                        </select>
                    </div>
                    <fieldset className={typeOfMovementSelect ? `data-box ${typeOfMovementSelect}` : "data-box"} >
                        <div className="field-box">
                            <label>Scooter
                                <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                            </label>
                        </div>
                        <div className="field-box logistic-operator">
                            <label>Operador Logístico
                                <select name="logisticOperatorMovement" onChange={handleChange} value={newMovementState.LO}>
                                    <option value="">-----</option>
                                    {logisticOperatorFromAPI.map(logisitcOperator => (
                                        <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                                    ))}
                                </select>
                            </label>
                            <label>Destino do Patinete
                                <select name="destinyScooterInternalMovement" onChange={handleChange} value={destinyScooterInternalMovement}>
                                    <option value="maintenance">Manutenção</option>
                                    <option value="backup">Backup</option>
                                </select>
                            </label>
                        </div>
                        <div className="field-box delivery-man">
                            <label>CPF Entregador
                                <input type="text" name="cpfPeopleRegistrationState" value={newMovementState.cpfPeopleRegistrationState} onChange={handleChange} />
                            </label>
                        </div>
                        <div className="field-box accessories">
                            <label>Capacete
                                <input type="checkbox" name="accessoriesHelmet" checked={newMovementState.accessoriesHelmet} onChange={handleCheck} />
                            </label>
                            <label>Bag
                                <input type="checkbox" name="accessoriesBag" checked={newMovementState.accessoriesBag} onChange={handleCheck} />
                            </label>
                            <label>Case
                                <input type="checkbox" name="accessoriesCase" checked={newMovementState.accessoriesCase} onChange={handleCheck} />
                            </label>
                            <label>Carregador
                                <input type="checkbox" name="accessoriesCharger" checked={newMovementState.accessoriesCharger} onChange={handleCheck} />
                            </label>
                        </div>
                        <div className="field-box">
                            <label>Observação
                                <textarea name="observation" value={newMovementState.observation} onChange={handleChange}></textarea>
                            </label>
                        </div>
                    </fieldset>
                </section>
                <div className="buttonBox">
                    <button className="submit-button clean" onClick={handleClean}>Limpar</button>
                    <button className="submit-button confirm" onClick={handleClickAdd}>Registrar</button>
                </div>
            </section>
        </main>
    )
}