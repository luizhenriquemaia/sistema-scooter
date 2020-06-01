import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getMovements } from '../../actions/movement'


export default function Movement() {
    const dispatch = useDispatch()
    const history = useHistory()
    const movements = useSelector(state => state.movements.movement)
    const [MovementState, setMovementState] = useState([{
        id: "",
        dataMovement: "",
        scooter: "",
        cpfDeliveryman: "",
        typeMovement: "",
        destiny: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    }])
    const [newMovementState, setNewMovementState] = useState({
        scooter: "",
        cpfDeliveryman: "",
        typeMovement: "",
        destiny: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    })
    
    useEffect(() => {
        if (movements.length !== 0) setMovementState(movements)
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
                            <td>{movement.scooter}</td>
                            <td>{movement.deliveryman}</td>
                            <td>{movement.pickUpTime}</td>
                            <td>{movement.returnTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <label>Scooter</label>
            <input type="text" name="scooter" onChange={handleChange} />
            <label>CPF Entregador</label>
            <input type="text" name="cpfDeliveryman" onChange={handleChange} />
            <label>Capacete</label>
            <input type="checkbox" name="accessoriesHelmet" onChange={handleCheck} />
            <label>Bag</label>
            <input type="checkbox" name="accessoriesBag" onChange={handleCheck} />
            <label>Case</label>
            <input type="checkbox" name="accessoriesCase" onChange={handleCheck} />
            <label>Carregador</label>
            <input type="checkbox" name="accessoriesCharger" onChange={handleCheck} />
            <button className="submit-button">Nova Movimentação</button>
        </div>
    )
}