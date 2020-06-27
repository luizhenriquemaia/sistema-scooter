import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { postMovement, getLastMovementsOfScooter, updateMovement } from '../../actions/movement'
import { getLogisticOperator } from '../../actions/logisticOperator'


//// SE A MOVIMENTAÇÃO TIVER ID DISPATCH PARA O UPDATE
export default function addMovementComponent() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [newMovementState, setNewMovementState] = useState({
        idMovement: "",
        typeMovement: "Externa",
        scooter: "",
        logisticOperatorMovement: "",
        cpfPeopleRegistration: "",
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


    const openMovementOfScooter = useSelector(state => state.movements.movement)
    const movementForAddComponent = useSelector(state => state.movements.isAdd)

    useEffect(() => {
        if (openMovementOfScooter !== undefined && openMovementOfScooter !== "") {
            if (movementForAddComponent === true) {
                if (!openMovementOfScooter.map) {
                    setNewMovementState({
                        idMovement: openMovementOfScooter.id,
                        typeMovement: openMovementOfScooter.typeMovement !== undefined && openMovementOfScooter.typeMovement !== null ? openMovementOfScooter.typeMovement.description : "Externa",
                        scooter: openMovementOfScooter.scooter !== undefined && openMovementOfScooter.scooter !== null ? openMovementOfScooter.scooter.chassisNumber : "",
                        logisticOperatorMovement: openMovementOfScooter.logisticOperatorMovement !== undefined && openMovementOfScooter.logisticOperatorMovement !== null ? openMovementOfScooter.logisticOperatorMovement.description : "",
                        cpfPeopleRegistration: openMovementOfScooter.peopleRegistration !== undefined && openMovementOfScooter.peopleRegistration !== null ? openMovementOfScooter.peopleRegistration.cpf : "",
                        accessoriesHelmet: openMovementOfScooter.accessoriesHelmet,
                        accessoriesBag: openMovementOfScooter.accessoriesBag,
                        accessoriesCase: openMovementOfScooter.accessoriesCase,
                        accessoriesCharger: openMovementOfScooter.accessoriesCharger,
                        observation: openMovementOfScooter.observation
                    })
                }
            }
        } else {
            setNewMovementState({
                ...newMovementState,
                idMovement: "",
                typeMovement: "Externa",
                logisticOperatorMovement: "",
                cpfPeopleRegistration: "",
                accessoriesHelmet: false,
                accessoriesBag: false,
                accessoriesCase: false,
                accessoriesCharger: false,
                observation: ""
            })
        }
    }, [openMovementOfScooter])


    const handleChange = e => {
        const { name, value } = e.target
        if (name === "destinyScooterInternalMovement") {
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
            cpfPeopleRegistration: "",
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

    const handleSubmit = e => {
        const { idMovement, typeMovement, scooter, logisticOperatorMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        let cpfPeopleRegistration = newMovementState.cpfPeopleRegistration.replace(/\D/g, '')
        if (typeMovement === "Externa") {
            if (scooter === "" || cpfPeopleRegistration === "") {
                alert.error("preencha todos os campos obrigatórios")
            }
            else if (cpfPeopleRegistration !== "" && cpfPeopleRegistration.length !== 11) {
                alert.error("cpf inválido")
            }
            else {
                var newMovementToAPI = { idMovement, typeMovement, scooter, cpfPeopleRegistration, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
                if (idMovement !== "") {
                    newMovementToAPI = {
                        ...newMovementToAPI,
                        initialTimeFormatted: "",
                        finalTimeFormatted: ""
                    }
                    dispatch(updateMovement(idMovement, newMovementState))
                } else {
                    dispatch(postMovement(newMovementToAPI))
                }
                setNewMovementState({
                    ...newMovementState,
                    idMovement: "",
                    typeOfMovement: "Externa",
                    scooter: "",
                    cpfPeopleRegistration: "",
                    accessoriesHelmet: false,
                    accessoriesBag: false,
                    accessoriesCase: false,
                    accessoriesCharger: false,
                    observation: ""
                })
            }
        }
        else if (typeMovement === "Interna") {
            if (scooter === "") {
                alert.error("preencha todos os campos obrigatórios")
            }
            else {
                var newMovementToAPI = { idMovement, typeMovement, destinyScooterToAPI, scooter, logisticOperatorMovement, observation }
                var destinyScooterToAPI = destinyScooterInternalMovement
                // is a return of scooter
                if (idMovement !== "") {
                    newMovementToAPI = {
                        ...newMovementToAPI,
                        initialTimeFormatted: "",
                        finalTimeFormatted: ""
                    }
                    dispatch(updateMovement(idMovement, newMovementState))
                } else {
                    dispatch(postMovement(newMovementToAPI))
                }
                setNewMovementState({
                    ...newMovementState,
                    idMovement: "",
                    typeMovement: "Externa",
                    scooter: "",
                    cpfPeopleRegistration: "",
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
                        <select name="typeMovement" value={newMovementState.typeMovement} onChange={handleChange} >
                            <option value="Externa">Externa</option>
                            <option value="Interna">Interna</option>
                        </select>
                    </div>
                    <fieldset className={newMovementState.typeMovement === "Externa" ? `data-box external` : "data-box internal"} >
                        <div className="field-box external">
                            <div className="field-box two-boxes">
                            <div className="field-box delivery-man">
                                <label>CPF Entregador
                                    <input type="text" name="cpfPeopleRegistration" value={newMovementState.cpfPeopleRegistration} onChange={handleChange} />
                                </label>
                            </div>
                                <div className="field-box scooter">
                                    <label>Chassi do Patinete
                                        <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                                    </label>
                                </div>
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
                        </div>
                        <div className="field-box internal">
                            <div className="field-box scooter">
                                <label>Scooter
                                    <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                                </label>
                            </div>
                            <div className="field-box logistic-operator">
                                <label>Operador Logístico
                                    <select name="logisticOperatorMovement" onChange={handleChange} value={newMovementState.logisticOperatorMovement}>
                                        <option value="">-----</option>
                                        {logisticOperatorFromAPI.map(logisitcOperator => (
                                            <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div className="field-box scooter-destination">
                                <label>Destino do Patinete
                                    <select name="destinyScooterInternalMovement" onChange={handleChange} value={destinyScooterInternalMovement}>
                                        <option value="maintenance">Manutenção</option>
                                        <option value="backup">Backup</option>
                                    </select>
                                </label>
                            </div>
                            <div className="field-box">
                                <label>Observação
                                    <textarea name="observation" value={newMovementState.observation} onChange={handleChange}></textarea>
                                </label>
                            </div>
                        </div>
                    </fieldset>
                </section>
                <div className="buttonBox">
                    <button className="submit-button clean" onClick={handleClean}>Limpar</button>
                    <button className="submit-button confirm" onClick={handleSubmit}>Registrar</button>
                </div>
            </section>
        </main>
    )
}