import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { getMovements, getMovementsWithFilters, deleteMovement } from '../../actions/movement'
import { getScooters } from '../../actions/scooters'


export default function Movements() {
    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()
    const today = new Date()
    const [userWantsToDeleteMovement, setUserWantsToDeleteMovement] = useState(false)
    const [idMovementUserWantsToDelete, setIdMovementUserWantsToDelete] = useState(-1)
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
        if (movements !== undefined) {
            if (movements.length !== 0) {

                if (isDetails === false && isAdd === false) {
                    if (movements.map) {
                        movements.map(movement => {
                            movement.timePickUpFormatted = formattingTime(movement.intialDateMovement, movement.pickUpTime)
                            if (movement.returnTime !== null) movement.timeReturnFormatted = formattingTime(movement.intialDateMovement, movement.returnTime)
                        })
                        setMovementState(movements)
                        setShouldGetMovements(false)
                    }
                }
                else {
                    setShouldGetMovements(true)
                }
            }
            else {
                if (movements !== '') {
                    setShouldGetMovements(true)
                }
                else {
                    setShouldGetMovements(false)
                }
                setMovementState([{
                    id: 0, dataMovement: "", scooter: { chassisNumber: "" }, logisticOperator: { description: "" },
                    peopleRegistration: { name: "" }, typeRelease: "", accessoriesHelmet: false, accessoriesBag: false,
                    accessoriesCase: false, accessoriesCharger: false, observation: "", timePickUpFormatted: "", timeReturnFormatted: ""
                }])
            }
        }
        
        else {
            // api returns "" so if movements is empty is because there is not a movement in database
            if (movements !== '') {
                setShouldGetMovements(true)
            }
            else {
                setShouldGetMovements(false)
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
                if (scooter.status.description === "Backup") numberOfScootersInBackup += 1
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
            dispatch(getMovements())
            dispatch(getScooters())
        }
    }, [shouldGetMovements])


    const handleGoToDetails = (idMovement) => history.push(`details-movement/${idMovement}`)

    const handleDeleteMovement = (idMovement) => {
        setIdMovementUserWantsToDelete(idMovement)
        setUserWantsToDeleteMovement(true)
    }

    const handleConfirmDelete = () => {
        if (idMovementUserWantsToDelete >= 0) {
            alert.info("a movimentação será excluida")
            dispatch(deleteMovement(idMovementUserWantsToDelete))
            setUserWantsToDeleteMovement(false)
            setIdMovementUserWantsToDelete(-1)
        }
        
    }

    const handleCancelDelete = () => {
        setUserWantsToDeleteMovement(false)
        setIdMovementUserWantsToDelete(-1)
        alert.info("ação cancelada")
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
                    setMovementState(movements.filter(movement => movement.typeMovement ? movement.typeMovement.description === filtersMovements.filterTypesMovements : movement.typeMovement === filtersMovements.filterTypesMovements ))
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
            <main className="content table">  
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patenetes</h1>
                    </div>
                    <section className="content-box">
                        <div className="important-data">
                            <div className="field-box">
                                <label>Total</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScooters} disabled />
                            </div>
                            <div className="field-box">
                                <label>Disponíveis</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersAvailable} disabled />
                            </div>
                            <div className="field-box">
                                <label>Em Uso</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersInUse} disabled />
                            </div>
                            <div className="field-box">    
                                <label>Operantes</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersOperants} disabled  />
                            </div>
                            <div className="field-box">
                                <label>Manutenção</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersUnderMaintenance} disabled />
                            </div>
                            <div className="field-box">
                                <label>Backup</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersInBackup} disabled />
                            </div>
                        </div>
                        <div className="date-filter">
                            <div className="date-box">
                                <label>Data</label>
                                <input type="date" name="filterInitialDate" value={filtersMovements.filterInitialDate || ''} onChange={handleFiltersChange} />
                                <input type="date" name="filterFinalDate" value={filtersMovements.filterFinalDate || ''} onChange={handleFiltersChange} />
                            </div>                                
                            <button onClick={handleSetFilters}>Aplicar Filtros</button>
                        </div>
                        <div className="filters">
                            <div className="field-box">
                                <label>Incluir Data Final</label>
                                <input type="checkbox" name="filterShowFinalDate" checked={filtersMovements.filterShowFinalDate} onChange={handleCheckFilter} />
                            </div>
                            <div className="field-box">
                                <label>Patinetes Devolvidos</label>
                                <input type="checkbox" name="filterShowReturnedScooters" checked={filtersMovements.filterShowReturnedScooters} onChange={handleCheckFilter} />
                            </div>
                            <div className="field-box">    
                                <label>Mostrar Apenas Movimentações do Tipo</label>
                                <input type="text" name="filterTypesMovements" value={filtersMovements.filterTypesMovements || ''} onChange={handleFiltersChange} />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas a OL</label>
                                <input type="text" name="filterShowJustOneOL" value={filtersMovements.filterShowJustOneOL || ''} onChange={handleFiltersChange} />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas o Entregador</label>
                                <input type="text" name="filterByNamePeopleRegistration" value={filtersMovements.filterByNamePeopleRegistration || ''} onChange={handleFiltersChange} />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas o Patinete</label>
                                <input type="text" name="filterByChassis" value={filtersMovements.filterByChassis || ''} onChange={handleFiltersChange} />
                            </div>
                        </div>
                        <hr />
                        <div className="table-responsive-vertical">
                            <table className="table-movements table-bordered table-striped table-mc-gray">
                                <thead>
                                    <tr>
                                        <th>Data Retirada</th>
                                        {filtersMovements.filterShowFinalDate ? <th>Data Devolução</th> : <th className="hidden"></th>}
                                        <th>Hora Retirada</th>
                                        <th>Hora Devolução</th>
                                        <th>Movimentação</th>
                                        <th>Chassi</th>
                                        <th>Entregador</th>
                                        <th>OL</th>
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
                                            <td data-title="Data Retirada" className="pointer"onClick={() => handleGoToDetails(movement.id)}>{movement.intialDateMovement}</td>
                                            {
                                                filtersMovements.filterShowFinalDate ? 
                                                <td data-title="Data Devolução" onClick={() => handleGoToDetails(movement.id)}>{movement.finalDateMovement}</td> :
                                                <td data-title="Data Retirada" className="hidden"></td>
                                            }
                                            <td data-title="Hora Retirada">{movement.timePickUpFormatted}</td>
                                            <td data-title="Data Devolução">{movement.timeReturnFormatted}</td>
                                            <td data-title="Movimentação">{movement.typeMovement ? movement.typeMovement.description : ""}</td>
                                            <td data-title="Chassi" className="pointer" onClick={() => handleGoToDetails(movement.id)}>{movement.scooter.chassisNumber}</td>
                                            <td data-title="Entregador">{movement.peopleRegistration ? movement.peopleRegistration.name : ""}</td>
                                            <td data-title="OL">{movement.logisticOperator ? movement.logisticOperator.description : ""}</td>
                                            <td data-title="Capacete" className="check-table"><input type="checkbox" checked={movement.accessoriesHelmet} disabled /></td>
                                            <td data-title="Bag" className="check-table"><input type="checkbox" checked={movement.accessoriesBag} disabled /></td>
                                            <td data-title="Case" className="check-table"><input type="checkbox" checked={movement.accessoriesCase} disabled /></td>
                                            <td data-title="Carregador" className="check-table"><input type="checkbox" checked={movement.accessoriesCharger} disabled /></td>
                                        <td className="delete" onClick={() => handleDeleteMovement(movement.id)}>Delete</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </section>
                <div className={userWantsToDeleteMovement === true ? "content dialog-section show-up" : "content dialog-section"}>
                    <section className="section-main-box dialog-box">
                        <div className="message">
                            <h3>Você tem certeza que deseja excluir essa movimentação?</h3>
                        </div>
                        <div className="buttonBox">
                            <button className="submit-button clean" onClick={handleConfirmDelete}>Excluir</button>
                            <button className="submit-button confirm" onClick={handleCancelDelete}> Cancelar</button>  
                        </div>
                    </section>
                </div>
            </main>
        )
    }
    else {
        return (
            <main className="content table">
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patenetes</h1>
                    </div>
                    <section className="content-box">
                        <div className="important-data">
                            <div className="field-box">
                                <label>Total</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScooters} disabled />
                            </div>
                            <div className="field-box">
                                <label>Disponíveis</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersAvailable} disabled />
                            </div>
                            <div className="field-box">
                                <label>Em Uso</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersInUse} disabled />
                            </div>
                            <div className="field-box">    
                                <label>Operantes</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersOperants} disabled  />
                            </div>
                            <div className="field-box">
                                <label>Manutenção</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersUnderMaintenance} disabled />
                            </div>
                            <div className="field-box">
                                <label>Backup</label>
                                <input type="text" value={NumbersOfScootersState.numberOfScootersInBackup} disabled />
                            </div>
                        </div>
                        <div className="date-filter">
                            <div className="date-box">
                                <label>Data</label>
                                <input type="date" name="filterInitialDate" value={filtersMovements.filterInitialDate || ''} onChange={handleFiltersChange} />
                                <input type="date" name="filterFinalDate" value={filtersMovements.filterFinalDate || ''} onChange={handleFiltersChange} />
                            </div>                                
                            <button onClick={handleSetFilters}>Aplicar Filtros</button>
                        </div>
                        <hr />
                        <div className="table-responsive-vertical">
                            <table className="table-movements table-bordered table-striped table-mc-gray">
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
                        </div>
                    </section>
                </section>
            </main>
        )
    }
}