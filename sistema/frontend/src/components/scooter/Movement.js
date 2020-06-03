import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getMovements, addMovement } from '../../actions/movement'


export default function Movement() {
    const dispatch = useDispatch()
    const history = useHistory()
    const movements = useSelector(state => state.movements.movement)

    const [MovementState, setMovementState] = useState([{
        id: 0,
        dataMovement: "",
        scooter: {
            chassisNumber: ""},
        logisticOperator: {
            description: ""},
        deliveryman: {
            name: ""},
        typeMovement: "",
        destiny: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: "",
        timeFormatted: ""
    }])
    const [newMovementState, setNewMovementState] = useState({
        scooter: "",
        OL: "",
        cpfDeliverymanState: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    })

    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1]-1, dateSplited[2], timeSplited[0], timeSplited[1])
        var timeMovementFormatted = `${dateMovementFormatted.getHours()}:${dateMovementFormatted.getMinutes()}`
        return timeMovementFormatted
    }
    
    useEffect(() => {
        if (movements.length !== 0) {
            movements.map(movement => {
                movement.timeFormatted = formattingTime(movement.dateMovement, movement.pickUpTime)
            })
            setMovementState(movements)
        }
    }, [movements])

    useEffect(() => {
        dispatch(getMovements())
    }, [])

    const handleChange = e => {
        const { name, value } = e.target
        setNewMovementState({
            ...newMovementState,
            [name]: value
        })
        console.log(newMovementState)
    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setNewMovementState({
            ...newMovementState,
            [name]: checked
        })
    }

    const handleClick = (idMovement) => history.push(`details-movement/${idMovement}`)
    const handleClickAdicionar = e => {
        const { scooter, OL, cpfDeliverymanState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        const cpfDeliveryman = cpfDeliverymanState.replace(/\D/g, '')
        if (cpfDeliveryman.length !== 11) {
            console.log("invalid cpf")
        }
        else {
            const typeMovement = "retirada"
            const newMovementToAPI = { scooter, OL, cpfDeliveryman, typeMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
            dispatch(addMovement(newMovementToAPI))
        }
    }

    console.log(MovementState)


    return (
        <div className="content">
            <h1 className="title-page">Movimentações Patenetes</h1>
            <table className="table-movements">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Chassi</th>
                        <th>Entregador</th>
                        <th>OL</th>
                        <th>Hora Retirada</th>
                        <th>Hora Devolução</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {MovementState.map(movement => (
                        <tr key={movement.id}>
                            <td>{movement.dateMovement}</td>
                            <td>{movement.scooter.chassisNumber}</td>
                            <td>{movement.deliveryman.name}</td>
                            <td>{movement.logisticOperator.description}</td>
                            <td>{movement.timeFormatted}</td>
                            <td>{movement.returnTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <h2>Adicionar Nova Movimentação</h2>
            <label>Scooter</label>
            <input type="text" name="scooter" onChange={handleChange} />
            <label>Operador Logístico</label>
            <input type="text" name="OL" onChange={handleChange} />
            <label>CPF Entregador</label>
            <input type="text" name="cpfDeliverymanState" onChange={handleChange} />
            <label>Capacete</label>
            <input type="checkbox" name="accessoriesHelmet" onChange={handleCheck} />
            <label>Bag</label>
            <input type="checkbox" name="accessoriesBag" onChange={handleCheck} />
            <label>Case</label>
            <input type="checkbox" name="accessoriesCase" onChange={handleCheck} />
            <label>Carregador</label>
            <input type="checkbox" name="accessoriesCharger" onChange={handleCheck} />
            <label>Observação</label>
            <textarea name="observation" onChange={handleChange}></textarea>
            <button className="submit-button" onClick={handleClickAdicionar}>Adicionar</button>
        </div>
    )
}