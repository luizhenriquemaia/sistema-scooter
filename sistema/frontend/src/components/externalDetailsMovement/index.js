import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getMovement, updateMovement } from '../../actions/movement'


export default function externalDetailsMovement() {
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const idMovementParams = params.idMovement
    const [idMovement, setIdMovement] = useState(-1)
    const [movementState, setMovementState] = useState({
        intialDateMovement: "",
        finalDateMovement: "",
        scooter: "",
        cpfDeliveryman: "",
        LO: "",
        typeRelease: "",
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
    const movement = useSelector(state => state.movements.movement)

    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1] - 1, dateSplited[2], timeSplited[0], timeSplited[1])
        var timeMovementFormatted = `${String(dateMovementFormatted.getHours()).padStart(2, '0')}:${String(dateMovementFormatted.getMinutes()).padStart(2, '0')}`
        return timeMovementFormatted
    }

    useEffect(() => {
        if (movement.scooter) {
            if (movement.returnTime) {
                setMovementState({
                    intialDateMovement: movement.intialDateMovement,
                    finalDateMovement: movement.finalDateMovement,
                    scooter: movement.scooter.chassisNumber,
                    cpfDeliveryman: movement.deliveryman.cpf,
                    LO: movement.logisticOperator.description,
                    typeRelease: "devolução",
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
                    scooter: movement.scooter.chassisNumber,
                    cpfDeliveryman: movement.deliveryman.cpf,
                    LO: movement.logisticOperator.description,
                    typeRelease: "retirada",
                    typeMovement: "",
                    accessoriesHelmet: movement.accessoriesHelmet,
                    accessoriesBag: movement.accessoriesBag,
                    accessoriesCase: movement.accessoriesCase,
                    accessoriesCharger: movement.accessoriesCharger,
                    observation: movement.observation,
                    initialTimeFormatted: movement.intialDateMovement != null ? formattingTime(movement.intialDateMovement, movement.pickUpTime) : "",
                    finalTimeFormatted: movement.finalDateMovement != null ? formattingTime(movement.finalDateMovement, movement.returnTime) : "",
                })
            }
        }
    }, [movement])

    useEffect(() => {
        if (idMovement != -1) dispatch(getMovement(idMovement))
    }, [idMovement])

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
        const { intialDateMovement, finalDateMovement, initialTimeFormatted, finalTimeFormatted, scooter, cpfDeliveryman, LO, typeRelease, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = movementState
        const typeMovement = "entregas"
        const updateMovementData = { intialDateMovement, finalDateMovement, initialTimeFormatted, finalTimeFormatted, scooter, cpfDeliveryman, LO, typeRelease, typeMovement, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } 
        dispatch(updateMovement(idMovement, updateMovementData))        
        history.push("/")
    }


    return (
        <div className="content">
            <h1 className="title-page">Registro de movimentação de patinetes</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-input">
                    <label>Data Inicial</label>
                    <input type="date" name="intialDateMovement" value={movementState.intialDateMovement || ""} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Data Final</label>
                    <input type="date" name="finalDateMovement" value={movementState.finalDateMovement || ""} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Hora Inicial</label>
                    <input type="time" name="initialTimeFormatted" value={movementState.initialTimeFormatted || ""} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Hora Final</label>
                    <input type="time" name="finalTimeFormatted" value={movementState.finalTimeFormatted || ""} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Número do chassi</label>
                    <input type="text" name="scooter" value={movementState.scooter} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Operador Logístico</label>
                    <input type="text" name="LO" value={movementState.LO} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>CPF do Entregador</label>
                    <input type="text" name="cpfDeliveryman" value={movementState.cpfDeliveryman} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Retirada</label>
                    <input type="radio" name="typeRelease" value="retirada" checked={movementState.typeRelease == "retirada"} onChange={handleChange} />
                    <label>Devolução</label>
                    <input type="radio" name="typeRelease" value="devolução" checked={movementState.typeRelease == "devolução"} onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Destino</label>
                    <input type="radio" name="destinyScooter" value="base" checked={movementState.destinyScooter == "base"} onChange={handleChange} />
                    <span>Base</span>
                    <input type="radio" name="destinyScooter" value="manutenção" checked={movementState.destinyScooter == "manutenção"} onChange={handleChange} />
                    <span>Manutenção</span>
                </div>
                <div className="form-input">
                    <h4>Acessórios</h4>
                    <label>Capacete</label>
                    <input type="checkbox" name="accessoriesHelmet" checked={movementState.accessoriesHelmet} onChange={handleCheck} />
                    <label>Bag</label>
                    <input type="checkbox" name="accessoriesBag" checked={movementState.accessoriesBag} onChange={handleCheck} />
                    <label>Case</label>
                    <input type="checkbox" name="accessoriesCase" checked={movementState.accessoriesCase} onChange={handleCheck} />
                    <label>Carregador</label>
                    <input type="checkbox" name="accessoriesCharger" checked={movementState.accessoriesCharger} onChange={handleCheck} />
                </div>
                <div className="form-input">
                    <label>Observação</label>
                    <textarea name="observation" onChange={handleChange}></textarea>
                </div>
                <button className="submit-button">Registrar</button>
                <button className="submit-button" onClick={() => history.push("/")}>Cancelar</button>
            </form>
        </div>
    )
}