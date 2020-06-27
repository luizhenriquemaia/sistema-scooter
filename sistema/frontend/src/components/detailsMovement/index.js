import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getMovement, updateMovement } from '../../actions/movement'
import { getLogisticOperator } from '../../actions/logisticOperator'


export default function detailsMovement() {
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const idMovementParams = params.idMovement
    const [idMovement, setIdMovement] = useState(-1)
    const [movementState, setMovementState] = useState({
        intialDateMovement: "",
        finalDateMovement: "",
        scooter: "",
        cpfPeopleRegistration: "",
        logisticOperatorMovement: "",
        typeRelease: "Retirada",
        typeMovement: "",
        destinyScooter: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: "",
        initialTimeFormatted: "",
        finalTimeFormatted: ""
    })
    const [logisticOperatorFromAPI, setLogisticOperatorFromAPI] = useState([{
        id: "",
        description: ""
    }])
    const movement = useSelector(state => state.movements.movement)

    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1] - 1, dateSplited[2], timeSplited[0], timeSplited[1])
        var timeMovementFormatted = `${String(dateMovementFormatted.getHours()).padStart(2, '0')}:${String(dateMovementFormatted.getMinutes()).padStart(2, '0')}`
        return timeMovementFormatted
    }

    useEffect(() => {
        if (movement !== undefined) {
            if (movement.scooter) {
                if (movement.returnTime) {
                    setMovementState({
                        intialDateMovement: movement.intialDateMovement,
                        finalDateMovement: movement.finalDateMovement,
                        scooter: movement.scooter ? movement.scooter.chassisNumber : "",
                        cpfPeopleRegistration: movement.peopleRegistration ? movement.peopleRegistration.cpf : "",
                        logisticOperatorMovement: movement.logisticOperator ? movement.logisticOperator_id : "",
                        typeRelease: "Devolução",
                        typeMovement: "",
                        accessoriesHelmet: movement.accessoriesHelmet,
                        accessoriesBag: movement.accessoriesBag,
                        accessoriesCase: movement.accessoriesCase,
                        accessoriesCharger: movement.accessoriesCharger,
                        observation: movement.observation,
                        destinyScooter: movement.destinyScooter,
                        initialTimeFormatted: movement.intialDateMovement != null ? formattingTime(movement.intialDateMovement, movement.pickUpTime) : "",
                        finalTimeFormatted: movement.finalDateMovement != null ? formattingTime(movement.finalDateMovement, movement.returnTime) : "",
                    })
                }
                else {
                    setMovementState({
                        intialDateMovement: movement.intialDateMovement,
                        finalDateMovement: movement.finalDateMovement,
                        scooter: movement.scooter ? movement.scooter.chassisNumber : "",
                        cpfPeopleRegistration: movement.peopleRegistration ? movement.peopleRegistration.cpf : "",
                        logisticOperatorMovement: movement.logisticOperator ? movement.logisticOperator_id : "",
                        typeRelease: "Retirada",
                        typeMovement: "",
                        accessoriesHelmet: movement.accessoriesHelmet,
                        accessoriesBag: movement.accessoriesBag,
                        accessoriesCase: movement.accessoriesCase,
                        accessoriesCharger: movement.accessoriesCharger,
                        observation: movement.observation,
                        initialTimeFormatted: movement.intialDateMovement != null && movement.intialDateMovement != "" ? formattingTime(movement.intialDateMovement, movement.pickUpTime) : "",
                        finalTimeFormatted: movement.finalDateMovement != null && movement.finalDateMovement != "" ? formattingTime(movement.finalDateMovement, movement.returnTime) : ""
                    })
                }
            }
        }
    }, [movement])

    useEffect(() => {
        if (idMovement != -1) {
            dispatch(getMovement(idMovement))
            dispatch(getLogisticOperator())
        }
    }, [idMovement])

    const logisticOperator = useSelector(state => state.logisticOperator.logisticOperator)

    useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            setLogisticOperatorFromAPI(logisticOperator)
        }
    }, [logisticOperator])

    useEffect(() => {
        setIdMovement(idMovementParams)
    }, [idMovementParams])


    const handleChange = e => {
        const { name, value } = e.target
        setMovementState({
            ...movementState,
            [name]: value
        })
    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setMovementState({
            ...movementState,
            [name]: checked
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        const { intialDateMovement, finalDateMovement, initialTimeFormatted, finalTimeFormatted, scooter, cpfPeopleRegistration, logisticOperatorMovement, typeRelease, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = movementState
        const updateMovementData = { intialDateMovement, finalDateMovement, initialTimeFormatted, finalTimeFormatted, scooter, cpfPeopleRegistration, logisticOperatorMovement, typeRelease, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
        dispatch(updateMovement(idMovement, updateMovementData))
        history.push("/")
    }

    return (
        <main className="content">
            <section className="section-main-box details-section">
                <div className="title-box">
                    <h1 className="title-page">Registro de movimentação de patinetes</h1>
                </div>
                <section className="content-box">
                    <fieldset className="data-box" onSubmit={handleSubmit}>
                        <div className="data-hora">
                            <div className="field-box">
                                <label>Data</label>
                                <input type="date" name="intialDateMovement" value={movementState.intialDateMovement || ""} onChange={handleChange} />
                            </div>
                            <div className="field-box">
                                <label>Hora Inicial</label>
                                <input type="time" name="initialTimeFormatted" value={movementState.initialTimeFormatted || ""} onChange={handleChange} />
                            </div>
                            <div className="field-box">
                                <label>Hora Final</label>
                                <input type="time" name="finalTimeFormatted" value={movementState.finalTimeFormatted || ""} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="field-box">
                            <label>Número do chassi</label>
                            <input type="text" name="scooter" value={movementState.scooter} onChange={handleChange} />
                        </div>
                        <div className="field-box">
                            <label>Operador Logístico</label>
                            <select name="logisticOperatorMovement" onChange={handleChange} value={movementState.logisticOperatorMovement}>
                                <option value="">-----</option>
                                {logisticOperatorFromAPI.map(logisitcOperator => (
                                    <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field-box">
                            <label>CPF do Entregador</label>
                            <input type="text" name="cpfPeopleRegistration" value={movementState.cpfPeopleRegistration} onChange={handleChange} />
                        </div>
                        <div className="field-box movement">
                            <div className="field-box">
                                <label>Retirada</label>
                                <input type="radio" name="typeRelease" value="Retirada" checked={movementState.typeRelease == "Retirada"} onChange={handleChange} />
                            </div>
                            <div className="field-box">
                                <label>Devolução</label>
                                <input type="radio" name="typeRelease" value="Devolução" checked={movementState.typeRelease == "Devolução"} onChange={handleChange} />
                            </div>
                        </div>
                        <div className={movementState.typeRelease == "Devolução" ? "field-box destination-box destination-up" :"field-box destination-box"}>                        
                            <span>
                                <h4>Destino</h4>
                            </span>
                            <div className="destination-choice">
                                <div className="field-box">
                                    <label>Base</label>
                                    <input type="radio" name="destinyScooter" value="Base" checked={movementState.destinyScooter == "Base"} onChange={handleChange} />
                                </div>
                                <div className="field-box">
                                    <label>Manutenção</label>
                                    <input type="radio" name="destinyScooter" value="Manutenção" checked={movementState.destinyScooter == "Manutenção"} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="field-box">
                            <span>
                                <h4>Acessórios</h4>
                            </span>
                            <div className="accessories-options">
                                <div className="field-box">
                                    <label>Capacete</label>
                                    <input type="checkbox" name="accessoriesHelmet" checked={movementState.accessoriesHelmet} onChange={handleCheck} />
                                </div>
                                <div className="field-box">
                                    <label>Bag</label>
                                    <input type="checkbox" name="accessoriesBag" checked={movementState.accessoriesBag} onChange={handleCheck} />
                                </div>
                                <div className="field-box">
                                    <label>Case</label>
                                    <input type="checkbox" name="accessoriesCase" checked={movementState.accessoriesCase} onChange={handleCheck} />
                                </div>
                                <div className="field-box">
                                    <label>Carregador</label>
                                    <input type="checkbox" name="accessoriesCharger" checked={movementState.accessoriesCharger} onChange={handleCheck} />
                                </div>
                            </div>
                        </div>
                        <div className="field-box">
                            <label>Observação</label>
                            <textarea name="observation" onChange={handleChange}></textarea>
                        </div>
                    </fieldset>
                </section>
                <div className="buttonBox">
                    <button className="submit-button clean" onClick={() => history.push("/")}>Cancelar</button>
                    <button className="submit-button confirm" onClick={handleSubmit}>Registrar</button>
                </div>
            </section>
        </main>
    )
}