import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { getMovements, getMovementsWithFilters, addMovement, deleteMovement } from '../../actions/movement'
import { getScooters } from '../../actions/scooters'



export default function externalMovement() {
    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()
    const today = new Date()
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

    const [ScootersState, setScootersState] = useState([{
        scooter: {
            chassisNumber: ""
        }
    }])

    const [NumbersOfScootersState, setNumbersOfScootersState] = useState({
        numberOfScooters: 0,
        numberOfScootersInUse: 0,
        numberOfScootersAvailable: 0,
        numberOfScootersUnderMaintenance: 0
    })

    const [newMovementState, setNewMovementState] = useState({
        scooter: "",
        cpfDeliverymanState: "",
        accessoriesHelmet: false,
        accessoriesBag: false,
        accessoriesCase: false,
        accessoriesCharger: false,
        observation: ""
    })

    const [filtersMovements, setFiltersMovements] = useState({
        filterInitialDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
        filterFinalDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
        filterShowReturnedScooters: true,
        filterShowJustOneOL: "",
        filterByNameDeliveryman: "",
        filterByChassis: ""
    })

    const [shouldGetMovements, setShouldGetMovements] = useState(false)
    const movements = useSelector(state => state.movements.movement)
    const scooters = useSelector(state => state.scooters.scooter)
    const isDetails = useSelector(state => state.movements.isDetails)


    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1]-1, dateSplited[2], timeSplited[0], timeSplited[1])
        // add 0 digit to hours below 10
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
            if (isDetails === false) {      
                movements.map(movement => {
                    movement.timePickUpFormatted = formattingTime(movement.dateMovement, movement.pickUpTime)
                    if (movement.returnTime !== null) movement.timeReturnFormatted = formattingTime(movement.dateMovement, movement.returnTime)
                })
                setMovementState(movements)
                setShouldGetMovements(false)
            }
            else {
                setShouldGetMovements(true)
            }
        }
        else {
            // api returns "" so if movements is empty is because there is not a movement in database
            if (movements !== ''){
                setShouldGetMovements(true)
            }
            setMovementState([{id: 0, dataMovement: "", scooter: {chassisNumber: ""}, logisticOperator: {description: ""},
                deliveryman: {name: ""}, typeMovement: "", destiny: "", accessoriesHelmet: false, accessoriesBag: false,
                accessoriesCase: false, accessoriesCharger: false, observation: "", timePickUpFormatted: "", timeReturnFormatted: ""
            }])
        }
    }, [movements])


    useEffect(() => {
        if (scooters.length !== 0 && scooters !== undefined) {
            let numberOfScooters = 0
            let numberOfScootersInUse = 0
            let numberOfScootersAvailable = 0
            let numberOfScootersUnderMaintenance = 0

            scooters.map(scooter => {
                if (scooter.status.description === "Em uso") numberOfScootersInUse += 1
                if (scooter.status.description === "Disponível") numberOfScootersAvailable += 1
                if (scooter.status.description === "Em manutenção") numberOfScootersUnderMaintenance += 1
                numberOfScooters += 1
            })
            setNumbersOfScootersState({
                numberOfScooters,
                numberOfScootersInUse,
                numberOfScootersAvailable,
                numberOfScootersUnderMaintenance
            })
            setScootersState(scooters)
        }
    }, [scooters])


    useEffect(() => {        
        if (shouldGetMovements === true) {
            dispatch(getMovements())
            dispatch(getScooters())
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

    const handleGoToDetails = (idMovement) => history.push(`external-details-movement/${idMovement}`)

    const handleDeleteMovement = (idMovement) => {
        alert.info("a movimentação será excluida")
        dispatch(deleteMovement(idMovement))
    }

    const handleClickAdd = e => {
        const { scooter, cpfDeliverymanState, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        const cpfDeliveryman = cpfDeliverymanState.replace(/\D/g, '')
        if (cpfDeliveryman.length !== 11) {
            alert.error("cpf inválido")
        }
        else {
            const typeMovement = "retirada"
            const newMovementToAPI = { scooter, cpfDeliveryman, typeMovement, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation }
            dispatch(addMovement(newMovementToAPI))
        }
        setNewMovementState({scooter: "", cpfDeliverymanState: "", accessoriesHelmet: false, accessoriesBag: false, accessoriesCase: false, accessoriesCharger: false, observation: ""})
    }

    console.log(scooters)


    // HANDLE FILTER THINGS
    useEffect(() => {
        if (movements !== '') {
            if (!filtersMovements.filterShowReturnedScooters) {
                setMovementState(movements.filter(movement => movement.returnTime === null))
            }
            if (filtersMovements.filterShowReturnedScooters) {
                setMovementState(movements)
            }
            if (filtersMovements.filterShowJustOneOL) {
                if (filtersMovements.filterShowJustOneOL !== "") {
                    setMovementState(movements.filter(movement => movement.logisticOperator.description === filtersMovements.filterShowJustOneOL))
                }
            }
            if (filtersMovements.filterByNameDeliveryman) {
                if (filtersMovements.filterByNameDeliveryman !== "") {
                    setMovementState(movements.filter(movement => movement.deliveryman.name === filtersMovements.filterByNameDeliveryman))
                }
            }
            if (filtersMovements.filterByChassis) {
                if (filtersMovements.filterByChassis !== "") {
                    setMovementState(movements.filter(movement => movement.scooter.chassisNumber == filtersMovements.filterByChassis))
                }
            }
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
        const { filterInitialDate, filterFinalDate  } = filtersMovements
        if (filterInitialDate && filterFinalDate) {
            if (filterInitialDate <= filterFinalDate) {
                const filtersMovements = { filterInitialDate, filterFinalDate }
                dispatch(getMovementsWithFilters(filtersMovements))
            }
            else {
                console.log("initial date must be before final date")
            }
        }
    }

    if (shouldGetMovements === false) {
        return (
            <div className="content">
                <h1 className="title-page">Movimentações Patenetes</h1>
                <div>
                    <label>Data</label>
                    <input type="date" name="filterInitialDate" value={filtersMovements.filterInitialDate || ''} onChange={handleFiltersChange} />
                    <input type="date" name="filterFinalDate" value={filtersMovements.filterFinalDate || ''} onChange={handleFiltersChange} />
                    <button onClick={handleSetFilters}>Aplicar Filtros</button>
                </div>
                <div>
                    <label>Mostrar Patinetes Devolvidos</label>
                    <input type="checkbox" name="filterShowReturnedScooters" checked={filtersMovements.filterShowReturnedScooters} onChange={handleCheckFilter} />
                    <label>Mostrar Apenas a OL</label>
                    <input type="text" name="filterShowJustOneOL" value={filtersMovements.filterShowJustOneOL || ''} onChange={handleFiltersChange} />
                    <label>Mostrar Apenas o Entregador</label>
                    <input type="text" name="filterByNameDeliveryman" value={filtersMovements.filterByNameDeliveryman || ''} onChange={handleFiltersChange} />
                    <label>Mostrar Apenas o Patinete</label>
                    <input type="text" name="filterByChassis" value={filtersMovements.filterByChassis || ''} onChange={handleFiltersChange} />
                </div>
                <div>
                    <label>Patinetes Totais</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScooters} disabled />
                    <label>Patinetes Disponíveis</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersAvailable} disabled />
                    <label>Patinetes Sendo Utilizados</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersInUse} disabled />
                    <label>Patinetes em Manutenção</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersUnderMaintenance} disabled />
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
                            <th>Capacete</th>
                            <th>Bag</th>
                            <th>Case</th>
                            <th>Carregador</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {MovementState.map(movement => (
                            <tr key={movement.id}>
                                <td onClick={() => handleGoToDetails(movement.id)}>{movement.dateMovement}</td>
                                <td onClick={() => handleGoToDetails(movement.id)}>{movement.scooter.chassisNumber}</td>
                                <td>{movement.deliveryman.name}</td>
                                <td>{movement.logisticOperator.description}</td>
                                <td>{movement.timePickUpFormatted}</td>
                                <td>{movement.timeReturnFormatted}</td>
                                <td><input type="checkbox" checked={movement.accessoriesHelmet} disabled /></td>
                                <td><input type="checkbox" checked={movement.accessoriesBag} disabled /></td>
                                <td><input type="checkbox" checked={movement.accessoriesCase} disabled /></td>
                                <td><input type="checkbox" checked={movement.accessoriesCharger} disabled /></td>
                                <td onClick={() => handleDeleteMovement(movement.id)}>Delete</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <h2>Adicionar Nova Movimentação</h2>
                <label>Scooter</label>
                <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                <label>CPF Entregador</label>
                <input type="text" name="cpfDeliverymanState" value={newMovementState.cpfDeliverymanState} onChange={handleChange} />
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
                <button className="submit-button" onClick={handleClickAdd}>Adicionar</button>
            </div>
        )
    }
    else {
        return (
            <div className="content">
                <h1 className="title-page">Movimentações Patenetes</h1>
                <div>
                    <label>Data</label>
                    <input type="date" name="filterInitialDate" value={filtersMovements.filterInitialDate || ''} onChange={handleFiltersChange} />
                    <input type="date" name="filterFinalDate" value={filtersMovements.filterFinalDate || ''} onChange={handleFiltersChange} />
                    <button onClick={handleSetFilters}>Aplicar Filtros</button>
                </div>
                <div>
                    <label>Patinetes Totais</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScooters} disabled />
                    <label>Patinetes Disponíveis</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersAvailable} disabled />
                    <label>Patinetes Sendo Utilizados</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersInUse} disabled />
                    <label>Patinetes em Manutenção</label>
                    <input type="text" value={NumbersOfScootersState.numberOfScootersUnderMaintenance} disabled />
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
                            <th>Capacete</th>
                            <th>Bag</th>
                            <th>Case</th>
                            <th>Carregador</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
                <br />
                <h2>Adicionar Nova Movimentação</h2>
                <label>Scooter</label>
                <input type="text" name="scooter" value={newMovementState.scooter} onChange={handleChange} />
                <label>CPF Entregador</label>
                <input type="text" name="cpfDeliverymanState" value={newMovementState.cpfDeliverymanState} onChange={handleChange} />
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
                <button className="submit-button" onClick={handleClickAdd}>Adicionar</button>
            </div>
        )
    }
}