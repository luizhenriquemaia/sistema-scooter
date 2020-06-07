import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { getMovements, getMovementsWithFilters, addMovement } from '../../actions/movement'


export default function Movement() {
    const dispatch = useDispatch()
    const history = useHistory()
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
        timePickUpFormatted: "",
        timeReturnFormatted: ""
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

    const [filtersMovements, setFiltersMovements] = useState({
        filterInitialDate: "",
        filterFinalDate: "",
        filterShowReturnedScooters: true
    })

    const [shouldGetMovements, setShouldGetMovements] = useState(false)
    const movements = useSelector(state => state.movements.movement)
    const isDetails = useSelector(state => state.movements.isDetails)


    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1]-1, dateSplited[2], timeSplited[0], timeSplited[1])
        // add 0 digit to hour below 10
        if (dateMovementFormatted.getHours() < 10) {
            var timeMovementFormatted = `0${dateMovementFormatted.getHours()}:${dateMovementFormatted.getMinutes()}`
        }
        else {
            var timeMovementFormatted = `${dateMovementFormatted.getHours()}:${dateMovementFormatted.getMinutes()}`
        }
        return timeMovementFormatted
    }
    
    useEffect(() => {
        if (movements.length !== 0 && movements !== undefined) {
            if (isDetails !== undefined && isDetails === false) {
                movements.map(movement => {
                    movement.timePickUpFormatted = formattingTime(movement.dateMovement, movement.pickUpTime)
                    if (movement.returnTime !== null) movement.timeReturnFormatted = formattingTime(movement.dateMovement, movement.returnTime)
                })
                setMovementState(movements)
            }
            else {
                setShouldGetMovements(true)
            }
        }
        else {
            setShouldGetMovements(true)
            setMovementState([{id: 0, dataMovement: "", scooter: {chassisNumber: ""}, logisticOperator: {description: ""},
                deliveryman: {name: ""}, typeMovement: "", destiny: "", accessoriesHelmet: false, accessoriesBag: false,
                accessoriesCase: false, accessoriesCharger: false, observation: "", timePickUpFormatted: "", timeReturnFormatted: ""
            }])
        }
    }, [movements])


    useEffect(() => {
        if (shouldGetMovements == true) {
            dispatch(getMovements())
        }
    }, [shouldGetMovements])

    const handleChange = e => {
        const { name, value } = e.target
        setNewMovementState({
            ...newMovementState,
            [name]: value
        })
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
            setNewMovementState({scooter: "", OL: "", cpfDeliverymanState: "", accessoriesHelmet: false, accessoriesBag: false, accessoriesCase: false, accessoriesCharger: false, observation: ""})
        }
    }


    // HANDLE FILTER THINGS
    useEffect(() => {
        if (filtersMovements.filterShowReturnedScooters === false) {
            setMovementState(movements.filter(movement => movement.returnTime === null))
        }
        else {            
            setMovementState(movements)
        }
    }, [filtersMovements])

    const handleFiltersChange = e => {
        const { name, value } = e.target
        setFiltersMovements({
            ...filtersMovements,
            [name]: value
        })
    }

    const handleCheckFilter = e => {
        const { name, checked } = e.target
        setFiltersMovements({
            ...filtersMovements,
            [name]: checked
        })
    }

    const handleSetFilters = e => {
        const { filterInitialDate, filterFinalDate } = filtersMovements
        if (filterInitialDate <= filterFinalDate ) {
            const filtersMovements = { filterInitialDate, filterFinalDate }
            dispatch(getMovementsWithFilters(filtersMovements))
        }
        else {
            console.log("initial date must be before final date")
        }
    }

    console.log(MovementState)

    return (
        <div className="content">
            <h1 className="title-page">Movimentações Patenetes</h1>
            <div>
                <label>Data</label>
                <input type="date" name="filterInitialDate"  onChange={handleFiltersChange} />
                <input type="date" name="filterFinalDate" onChange={handleFiltersChange} />
                <button onClick={handleSetFilters}>Aplicar Filtros</button>
            </div>
            <div>
                <label>Mostrar Patinetes Devolvidos</label>
                <input type="checkbox" name="filterShowReturnedScooters" checked={filtersMovements.filterShowReturnedScooters} onChange={handleCheckFilter}/>

            </div>

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
                            <td onClick={() => handleClick(movement.id)}>{movement.dateMovement}</td>
                            <td>{movement.scooter.chassisNumber}</td>
                            <td>{movement.deliveryman.name}</td>
                            <td>{movement.logisticOperator.description}</td>
                            <td>{movement.timePickUpFormatted}</td>
                            <td>{movement.timeReturnFormatted}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br/>
            <h2>Adicionar Nova Movimentação</h2>
            <label>Scooter</label>
            <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
            <label>Operador Logístico</label>
            <input type="text" name="OL" value={newMovementState.OL} onChange={handleChange} />
            <label>CPF Entregador</label>
            <input type="text" name="cpfDeliverymanState" checked={newMovementState.cpfDeliverymanState} onChange={handleChange} />
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
            <button className="submit-button" onClick={handleClickAdicionar}>Adicionar</button>
        </div>
    )
}