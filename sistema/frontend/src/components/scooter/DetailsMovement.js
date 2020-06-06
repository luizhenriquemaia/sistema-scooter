import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { getMovement, updateMovement } from '../../actions/movement'


export default function Movement() {
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const idMovementParams = params.idMovement
    const [idMovement, setIdMovement] = useState(-1)
    const [movementState, setMovementState] = useState({
        scooter: "",
        cpfDeliveryman: "",
        LO: "",
        typeMovement: "",
        destinyScooter: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    })
    const movement = useSelector(state => state.movements.movement)

    useEffect(() => {
        if (movement.scooter) {
            if (movement.returnTime) {
                setMovementState({
                    scooter: movement.scooter.chassisNumber,
                    cpfDeliveryman: movement.deliveryman.cpf,
                    LO: movement.logisticOperator.description,
                    typeMovement: "devolução",
                    accessoriesHelmet: movement.accessoriesHelmet,
                    accessoriesBag: movement.accessoriesBag,
                    accessoriesCase: movement.accessoriesCase,
                    accessoriesCharger: movement.accessoriesCharger,
                    observation: movement.observation,
                    destinyScooter: movement.destinyScooter
                })
            }
            else {
                setMovementState({
                    scooter: movement.scooter.chassisNumber,
                    cpfDeliveryman: movement.deliveryman.cpf,
                    LO: movement.logisticOperator.description,
                    typeMovement: "retirada",
                    accessoriesHelmet: movement.accessoriesHelmet,
                    accessoriesBag: movement.accessoriesBag,
                    accessoriesCase: movement.accessoriesCase,
                    accessoriesCharger: movement.accessoriesCharger,
                    observation: movement.observation
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
        console.log(e.target.name)
        console.log(e.target.value)
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
        const { scooter, cpfDeliveryman, LO, typeMovement, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = movementState
        const updateMovementData = { scooter, cpfDeliveryman, LO, typeMovement, destinyScooter, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } 
        dispatch(updateMovement(idMovement, updateMovementData))
    }


    return (
        <div className="content">
            <h1 className="title-page">Registro de movimentação de patinetes</h1>
            <form onSubmit={handleSubmit}>
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
                    <input type="radio" name="typeMovement" value="retirada" checked={movementState.typeMovement == "retirada"} onChange={handleChange} />
                    <label>Devolução</label>
                    <input type="radio" name="typeMovement" value="devolução" checked={movementState.typeMovement == "devolução"} onChange={handleChange} />
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
                <button className="submit-button" onClick={() => history.goBack()}>Cancelar</button>
            </form>
        </div>
    )
}