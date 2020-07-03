import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { postMovement, getLastMovementsOfScooter, updateMovement } from '../../actions/movement'
import { getLogisticOperator } from '../../actions/logisticOperator'


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
    const [destinyScooterInternalMovementPickUp, setDestinyScooterInternalMovementPickUp] = useState("Manutenção")
    const [destinyScooterInternalMovementReturn, setDestinyScooterInternalMovementReturn] = useState("Base")
    const [destinyScooterExternalMovement, setDestinyScooterExternalMovement] = useState("Base")
    const [userWantsToUpdateExternalMovement, setUserWantsToUpdateExternalMovement] = useState(false)
    const [wasMovementAdded, setWasMovementAdded] = useState(false)
    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)
    const movementsFromAPI = useSelector(state => state.movements.movement)
    const movementForAddComponent = useSelector(state => state.movements.isAdd)

    useEffect(() => {
        dispatch(getLogisticOperator())
    }, [])

    useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])

    useEffect(() => {
        if (!wasMovementAdded) {
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
            }
        }
        // else {
        //     setNewMovementStateToInitial()
        // }
    }, [movementsFromAPI])


    const setNewMovementStateToInitial = () => {
        setNewMovementState({
            ...newMovementState,
            idMovement: "",
            scooter: "",
            logisticOperatorMovement: "",
            cpfPeopleRegistration: "",
            accessoriesHelmet: false,
            accessoriesBag: false,
            accessoriesCase: false,
            accessoriesCharger: false,
            observation: ""
        })
    }


    const handleChange = e => {
        const { name, value } = e.target
        switch (name) {
            case "destinyScooterInternalMovementPickUp":
                setDestinyScooterInternalMovementPickUp(value)
                break
            case "destinyScooterExternalMovement":
                setDestinyScooterExternalMovement(value)
                break
            case "destinyScooterInternalMovementReturn":
                setDestinyScooterInternalMovementReturn(value)
                break
            case "scooter":
                if (value.toString().length >= 4) {
                    dispatch(getLastMovementsOfScooter(value))
                    setWasMovementAdded(false)
                }
            default:
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

    const handleConfirmAccessoriesAndSubmitExternalMovement = e => {
        const { idMovement, typeMovement, scooter, logisticOperatorMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        let cpfPeopleRegistration = newMovementState.cpfPeopleRegistration.replace(/\D/g, '')
        var newMovementToAPI = { idMovement, typeMovement, scooter, logisticOperatorMovement, cpfPeopleRegistration, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
        var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterExternalMovement, typeRelease: "Devolução" }
        if (newMovementToAPI.idMovement !== "") {
            dispatch(updateMovement(idMovement, newMovementToAPI))
            setDestinyScooterExternalMovement("Base")
            setNewMovementStateToInitial()
            setWasMovementAdded(true)
        }
        setUserWantsToUpdateExternalMovement(false)
    }


    const handleSubmit = e => {
        const { idMovement, typeMovement, scooter, logisticOperatorMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        let cpfPeopleRegistration = newMovementState.cpfPeopleRegistration.replace(/\D/g, '')
        if (typeMovement === "Externa") {
            if (scooter === "" || cpfPeopleRegistration === "") {
                return alert.error("preencha todos os campos obrigatórios")
            }
            if (cpfPeopleRegistration !== "" && cpfPeopleRegistration.length !== 11) {
                return alert.error("cpf inválido")
            }
            if (scooter.toString().length < 4) {
                return alert.error("o chassi deve ter pelo menos 4 números")
            }
            var newMovementToAPI = { idMovement, typeMovement, scooter, logisticOperatorMovement, cpfPeopleRegistration, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
            var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterExternalMovement, typeRelease: "Devolução" }
            if (newMovementToAPI.idMovement !== "") {
                setUserWantsToUpdateExternalMovement(true)
            }
            else {
                dispatch(postMovement(newMovementToAPI))
                setDestinyScooterExternalMovement("Base")
                setWasMovementAdded(true)
                setNewMovementStateToInitial()
            }
        }
        else if (typeMovement === "Interna") {
            if (scooter === "" || logisticOperatorMovement === "") {
                return alert.error("preencha todos os campos obrigatórios")
            } 
            if (scooter.toString().length < 4) {
                return alert.error("o chassi deve ter pelo menos 4 números")
            }
            var newMovementToAPI = { idMovement, typeMovement, scooter, logisticOperatorMovement, observation  }
            var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterInternalMovementReturn }
            // is a return of scooter
            if (newMovementToAPI.idMovement !== "") {
                var newMovementToAPI = { 
                    ...newMovementToAPI, 
                    accessoriesHelmet: false, 
                    accessoriesBag: false, 
                    accessoriesCase: false, 
                    accessoriesCharger: false,
                    typeRelease: "Devolução"
                }
                dispatch(updateMovement(idMovement, newMovementToAPI))
                setWasMovementAdded(true)
            } else {
                var newMovementToAPI = { ...newMovementToAPI, destinyScooterToAPI: destinyScooterInternalMovementPickUp }
                dispatch(postMovement(newMovementToAPI))
                setWasMovementAdded(true)
            }
            setDestinyScooterInternalMovementPickUp("Manutenção")
            setDestinyScooterInternalMovementReturn("Base")
            setNewMovementStateToInitial()
        }
    }


    return (
        <div>
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
                                <label>Chassi
                                    <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                                </label>
                                <label>CPF Entregador
                                    <input type="text" name="cpfPeopleRegistration" value={newMovementState.cpfPeopleRegistration} onChange={handleChange} />
                                </label>
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
                        </div>
                        <div className="field-box internal">
                            <div className="field-box two-boxes">
                                <label>Chassi
                                    <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                                </label>
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
                                    <select name="destinyScooterInternalMovementPickUp" onChange={handleChange} value={destinyScooterInternalMovementPickUp}>
                                        <option value="Manutenção">Manutenção</option>
                                        <option value="Backup">Backup</option>
                                    </select>
                                </label>
                            </div>
                            <div className="scooter-destination">
                                <label>Destino
                                    <select name="destinyScooterInternalMovementReturn" onChange={handleChange} value={destinyScooterInternalMovementReturn}>
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
                        <button className="submit-button clean" onClick={() => setNewMovementStateToInitial()}>Limpar</button>
                    <button className="submit-button confirm" onClick={handleSubmit}>Registrar</button>
                </div>
            </section>
        </main>
            <div className={userWantsToUpdateExternalMovement ? "content dialog-section show-up" : "content dialog-section"}>
            <section className="section-main-box dialog-box">
                <div className="message">
                    <h3>Caso um acessório não tenha sido retornado, você pode voltar a página de cadastro e fazer uma observação.</h3>
                </div>
                <div className="buttonBox">
                        <button className="submit-button clean" onClick={() => setUserWantsToUpdateExternalMovement(false)}>Voltar</button>
                        <button className="submit-button confirm" onClick={handleConfirmAccessoriesAndSubmitExternalMovement}>Registrar</button>
                </div>
            </section>
        </div>
        </div>
    )
}