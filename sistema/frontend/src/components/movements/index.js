import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { getMovements, getMovementsWithFilters, addMovement, deleteMovement } from '../../actions/movement'
import { getScooters } from '../../actions/scooters'


export default function Movements() {
    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()
    const today = new Date()
    const [MovementState, setMovementState] = useState([{
        id: 0,
        intialDateMovement: "",
        scooter: {
            chassisNumber: ""
        },
        logisticOperator: {
            description: ""
        },
        peopleRegistration: {
            name: ""
        },
        typeMovement: "",
        typeRelease: "",
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
        numberOfScootersUnderMaintenance: 0,
        numberOfScootersOperants: 0,
        numberOfScootersInBackup: 0
    })

    const [filtersMovements, setFiltersMovements] = useState({
        filterInitialDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
        filterFinalDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
        filterShowFinalDate: false,
        filterShowReturnedScooters: true,
        filterTypesMovements: "",
        filterShowJustOneOL: "",
        filterByNamePeopleRegistration: "",
        filterByChassis: ""
    })

    const [shouldGetMovements, setShouldGetMovements] = useState(false)
    const movements = useSelector(state => state.movements.movement)
    const scooters = useSelector(state => state.scooters.scooter)
    const isDetails = useSelector(state => state.movements.isDetails)
    const isAdd = useSelector(state => state.movements.isAdd)


    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1] - 1, dateSplited[2], timeSplited[0], timeSplited[1])
        var timeMovementFormatted = `${String(dateMovementFormatted.getHours()).padStart(2, '0')}:${String(dateMovementFormatted.getMinutes()).padStart(2, '0')}`
        return timeMovementFormatted
    }

    useEffect(() => {
        if (movements.length !== 0 && movements !== undefined) {
            if (isDetails === false && isAdd === false) {
                movements.map(movement => {
                    movement.timePickUpFormatted = formattingTime(movement.intialDateMovement, movement.pickUpTime)
                    if (movement.returnTime !== null) movement.timeReturnFormatted = formattingTime(movement.intialDateMovement, movement.returnTime)
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
            if (movements !== '') {
                setShouldGetMovements(true)
            }
            setMovementState([{
                id: 0, dataMovement: "", scooter: { chassisNumber: "" }, logisticOperator: { description: "" },
                peopleRegistration: { name: "" }, typeRelease: "", accessoriesHelmet: false, accessoriesBag: false,
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
            let numberOfScootersOperants = 0
            let numberOfScootersInBackup = 0

            scooters.map(scooter => {
                if (scooter.status.description === "Em uso") {
                    numberOfScootersInUse += 1
                    numberOfScootersOperants += 1
                } 
                if (scooter.status.description === "Disponível") {
                    numberOfScootersAvailable += 1
                    numberOfScootersOperants += 1
                }
                if (scooter.status.description === "Manutenção") numberOfScootersUnderMaintenance += 1
                if (scooter.status.description === "Em backup") numberOfScootersInBackup += 1
                numberOfScooters += 1
            })
            setNumbersOfScootersState({
                numberOfScooters,
                numberOfScootersInUse,
                numberOfScootersAvailable,
                numberOfScootersUnderMaintenance,
                numberOfScootersOperants,
                numberOfScootersInBackup
            })
            setScootersState(scooters)
        }
    }, [scooters, MovementState, movements])


    useEffect(() => {
        if (shouldGetMovements === true) {
            dispatch(getMovements("entregas"))
            dispatch(getScooters())
        }
    }, [shouldGetMovements])


    const handleGoToDetails = (idMovement) => history.push(`details-movement/${idMovement}`)

    const handleDeleteMovement = (idMovement) => {
        alert.info("a movimentação será excluida")
        dispatch(deleteMovement(idMovement))
    }


    // HANDLE FILTER THINGS
    useEffect(() => {
        if (movements !== '') {
            if (!filtersMovements.filterShowReturnedScooters) {
                setMovementState(movements.filter(movement => movement.returnTime === null))
            }
            if (filtersMovements.filterShowReturnedScooters) {
                setMovementState(movements)
            }
            if (filtersMovements.filterTypesMovements) {
                if (filtersMovements.filterTypesMovements !== "") {
                    setMovementState(movements.filter(movement => movement.typeMovement.description === filtersMovements.filterTypesMovements))
                }
            }
            if (filtersMovements.filterShowJustOneOL) {
                if (filtersMovements.filterShowJustOneOL !== "") {
                    setMovementState(movements.filter(movement => movement.logisticOperator.description === filtersMovements.filterShowJustOneOL))
                }
            }
            if (filtersMovements.filterByNamePeopleRegistration) {
                if (filtersMovements.filterByNamePeopleRegistration !== "") {
                    setMovementState(movements.filter(movement => movement.peopleRegistration ? movement.peopleRegistration.name === filtersMovements.filterByNamePeopleRegistration : movement.peopleRegistration === filtersMovements.filterByNamePeopleRegistration))
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
        const { filterInitialDate, filterFinalDate } = filtersMovements
        if (filterInitialDate && filterFinalDate) {
            if (filterInitialDate <= filterFinalDate) {
                const filtersMovements = { filterInitialDate, filterFinalDate }
                dispatch(getMovementsWithFilters(filtersMovements))
            }
            else {
                alert.error("initial date must be before final date")
            }
        }
    }

    if (shouldGetMovements === false) {
        return (
            <main className="content">
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patenetes</h1>
                    </div>
                    <section className="content-box">
                        <div>
                            <label>Data</label>
                            <input type="date" name="filterInitialDate" value={filtersMovements.filterInitialDate || ''} onChange={handleFiltersChange} />
                            <input type="date" name="filterFinalDate" value={filtersMovements.filterFinalDate || ''} onChange={handleFiltersChange} />
                            <button onClick={handleSetFilters}>Aplicar Filtros</button>
                        </div>
                        <div>
                            <label>Mostrar Data Final</label>
                            <input type="checkbox" name="filterShowFinalDate" checked={filtersMovements.filterShowFinalDate} onChange={handleCheckFilter} />
                            <label>Mostrar Patinetes Devolvidos</label>
                            <input type="checkbox" name="filterShowReturnedScooters" checked={filtersMovements.filterShowReturnedScooters} onChange={handleCheckFilter} />
                            <label>Mostrar Apenas Movimentações do Tipo</label>
                            <input type="text" name="filterTypesMovements" value={filtersMovements.filterTypesMovements || ''} onChange={handleFiltersChange} />
                            <label>Mostrar Apenas a OL</label>
                            <input type="text" name="filterShowJustOneOL" value={filtersMovements.filterShowJustOneOL || ''} onChange={handleFiltersChange} />
                            <label>Mostrar Apenas o Entregador</label>
                            <input type="text" name="filterByNamePeopleRegistration" value={filtersMovements.filterByNamePeopleRegistration || ''} onChange={handleFiltersChange} />
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
                            <label>Patinetes Operantes</label>
                            <input type="text" value={NumbersOfScootersState.numberOfScootersOperants} disabled  />
                            <label>Patinetes em Manutenção</label>
                            <input type="text" value={NumbersOfScootersState.numberOfScootersUnderMaintenance} disabled />
                            <label>Patinetes em Backup</label>
                            <input type="text" value={NumbersOfScootersState.numberOfScootersInBackup} disabled />
                        </div>

                        <table className="table-movements">
                            <thead>
                                <tr>
                                    <th>Data Inicial</th>
                                    {filtersMovements.filterShowFinalDate ? <th>Data final</th> : <th></th>}
                                    <th>Chassi</th>
                                    <th>Entregador</th>
                                    <th>OL</th>
                                    <th>Tipo</th>
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
                                        <td onClick={() => handleGoToDetails(movement.id)}>{movement.intialDateMovement}</td>
                                        {
                                            filtersMovements.filterShowFinalDate ? 
                                            <td onClick={() => handleGoToDetails(movement.id)}>{movement.finalDateMovement}</td> :
                                            <td></td>
                                        }
                                        <td onClick={() => handleGoToDetails(movement.id)}>{movement.scooter.chassisNumber}</td>
                                        <td>{movement.peopleRegistration ? movement.peopleRegistration.name : ""}</td>
                                        <td>{movement.logisticOperator ? movement.logisticOperator.description : ""}</td>
                                        <td>{movement.typeMovement.description}</td>
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
                    </section>
                </section>
            </main>
        )
    }
    else {
        return (
            <main className="content">
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patenetes</h1>
                    </div>
                    <section className="content-box">
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
                    </section>
                </section>
            </main>
        )
    }
}