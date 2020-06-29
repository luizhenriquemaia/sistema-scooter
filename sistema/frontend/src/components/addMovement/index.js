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
        destinyScooter: "",
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
    const [destinyScooterInternalMovement, setDestinyScooterInternalMovement] = useState("Manutenção")
    const [destinyScooterExternalMovement, setDestinyScooterExternalMovement] = useState("Base")
    const [confimReturnedAccessories, setConfimReturnedAccessories] = useState(false)

    useEffect(() => {
        dispatch(getLogisticOperator())
    }, [])

    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)

    useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])


    const movementsFromAPI = useSelector(state => state.movements.movement)
    const movementForAddComponent = useSelector(state => state.movements.isAdd)

    useEffect(() => {
        if (movementsFromAPI !== undefined && movementsFromAPI !== "") {
            if (movementForAddComponent === true) {
                if (!movementsFromAPI.map) {
                    setNewMovementState({
                        idMovement: movementsFromAPI.id,
                        typeMovement: movementsFromAPI.typeMovement !== undefined && movementsFromAPI.typeMovement !== null ? movementsFromAPI.typeMovement.description : "Externa",
                        scooter: movementsFromAPI.scooter !== undefined && movementsFromAPI.scooter !== null ? movementsFromAPI.scooter.chassisNumber : "",
                        logisticOperatorMovement: movementsFromAPI.logisticOperator !== undefined && movementsFromAPI.logisticOperator !== null ? movementsFromAPI.logisticOperator.id : "",
                        cpfPeopleRegistration: movementsFromAPI.peopleRegistration !== undefined && movementsFromAPI.peopleRegistration !== null ? movementsFromAPI.peopleRegistration.cpf : "",
                        accessoriesHelmet: movementsFromAPI.accessoriesHelmet,
                        accessoriesBag: movementsFromAPI.accessoriesBag,
                        accessoriesCase: movementsFromAPI.accessoriesCase,
                        accessoriesCharger: movementsFromAPI.accessoriesCharger,
                        observation: movementsFromAPI.observation
                    })
                }
            }
        } else {
            setNewMovementState({
                ...newMovementState,
                idMovement: "",
                logisticOperatorMovement: "",
                cpfPeopleRegistration: "",
                accessoriesHelmet: false,
                accessoriesBag: false,
                accessoriesCase: false,
                accessoriesCharger: false,
                observation: ""
            })
        }
    }, [movementsFromAPI])


    const handleChange = e => {
        const { name, value } = e.target
        if (name === "destinyScooterInternalMovement") {
            setDestinyScooterInternalMovement(value)
        } else if (name === "destinyScooterExternalMovement") {
            setDestinyScooterExternalMovement(value)
        } else if (name === "scooter") {
            setNewMovementState({
                ...newMovementState,
                [name]: value
            })
            if (value.toString().length >= 4) dispatch(getLastMovementsOfScooter(value))
        } else {
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
                if (scooter.toString().length < 4) {
                    alert.error("o chassi deve ter pelo menos 4 números")
                } else {
                    var newMovementToAPI = { idMovement, typeMovement, scooter, logisticOperatorMovement, cpfPeopleRegistration, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
                    var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterExternalMovement, typeRelease: "Devolução"}
                    if (newMovementToAPI.idMovement !== "") {
                        if (confimReturnedAccessories === true) {
                            dispatch(updateMovement(idMovement, newMovementToAPI))
                        } else {
                            alert.error("você precisa confirmar que foram devolvidos os acessórios")
                            return
                        }
                    }
                    else dispatch(postMovement(newMovementToAPI))
                    setNewMovementState({
                        ...newMovementState,
                        idMovement: "",
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
        else if (typeMovement === "Interna") {
            if (scooter === "" || logisticOperatorMovement === "") {
                alert.error("preencha todos os campos obrigatórios")
            } else {
                if (scooter.toString().length < 4) {
                    alert.error("o chassi deve ter pelo menos 4 números")
                } else {
                    var newMovementToAPI = { idMovement, typeMovement, scooter, logisticOperatorMovement, observation  }
                    var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterInternalMovement }
                    // is a return of scooter
                    if (newMovementToAPI.idMovement !== "") {
                        var newMovementToAPI = { ...newMovementToAPI, 
                            accessoriesHelmet: false, 
                            accessoriesBag: false, 
                            accessoriesCase: false, 
                            accessoriesCharger: false,
                            typeRelease: "Devolução"
                        }
                        dispatch(updateMovement(idMovement, newMovementToAPI))
                    } else dispatch(postMovement(newMovementToAPI))
                    setNewMovementState({
                        ...newMovementState,
                        idMovement: "",
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
    }

    return (
        <main className="content">
            <section className={newMovementState.idMovement !== "" ? "section-main-box add-movement-section return" : "section-main-box add-movement-section"}>
                <div className="title-box">
                    <h1 className="title-page">Nova Movimentação</h1>
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
                                    <label>Chassi
                                        <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                                    </label>
                                </div>
                            </div>
                            <div className="scooter-destination">
                                <label>Destino
                                    <select name="destinyScooterExternalMovement" onChange={handleChange} value={destinyScooterExternalMovement}>
                                        <option value="Base">Base</option>
                                        <option value="Manutenção">Manutenção</option>
                                    </select>
                                </label>
                            </div>
                            <div className="field-box accessories">
                                <label>Capacete
                                    <input type="checkbox" name="accessoriesHelmet" checked={newMovementState.accessoriesHelmet} onChange={handleCheck} disabled={newMovementState.idMovement !== ""} />
                                </label>
                                <label>Bag
                                    <input type="checkbox" name="accessoriesBag" checked={newMovementState.accessoriesBag} onChange={handleCheck} disabled={newMovementState.idMovement !== ""} />
                                </label>
                                <label>Case
                                    <input type="checkbox" name="accessoriesCase" checked={newMovementState.accessoriesCase} onChange={handleCheck} disabled={newMovementState.idMovement !== ""} />
                                </label>
                                <label>Carregador
                                    <input type="checkbox" name="accessoriesCharger" checked={newMovementState.accessoriesCharger} onChange={handleCheck} disabled={newMovementState.idMovement !== ""} />
                                </label>
                            </div>
                            <div className="field-box observation">
                                <label>Observação
                                    <textarea name="observation" value={newMovementState.observation} onChange={handleChange}></textarea>
                                </label>
                            </div>
                            <div className="confirmation">
                                <label>Confirmo que todos os acessórios foram devolvidos
                                <input type="checkbox" name="" onChange={() => setConfimReturnedAccessories(true)} checked={confimReturnedAccessories} />
                                </label>
                            </div>
                        </div>
                        <div className="field-box internal">
                            <div className="field-box scooter">
                                <label>Chassi
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
                                <label>Destino
                                    <select name="destinyScooterInternalMovement" onChange={handleChange} value={destinyScooterInternalMovement}>
                                        <option value="Manutenção">Manutenção</option>
                                        <option value="Backup">Backup</option>
                                    </select>
                                </label>
                            </div>
                            <div className="scooter-destination">
                                <label>Destino
                                    <select name="destinyScooterInternalMovement" onChange={handleChange} value={destinyScooterInternalMovement}>
                                        <option value="Base">Base</option>
                                        <option value="Backup">Backup</option>
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