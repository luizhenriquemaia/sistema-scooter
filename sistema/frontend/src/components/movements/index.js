import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Select from 'react-select'
import { getMovements, getMovementsWithFilters, deleteMovement } from '../../actions/movement'
import { getScooters } from '../../actions/scooters'


const styleOfSelectFilter = {
    control: (provided) => ({
        ...provided,
        width: 200
    })
}


export default function Movements() {
    const dispatch = useDispatch()
    const history = useHistory()
    const alert = useAlert()
    const today = new Date()
    let typesMovementsArray = []
    let logisticsOperatorsArray = []
    let deliverymanArray = []
    let scootersArray = []
    let valuesToFilterMovements = []
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

    const [optionsTypeMovementSelect, setOptionsTypeMovementSelect] = useState([
        {value: -1, label: ""}
    ])
    const [optionsLogisticOperatorSelect, setOptionsLogisticOperatorSelect] = useState([
        { value: -1, label: "" }
    ])
    const [optionsDeliverymanSelect, setOptionsDeliverymanSelect] = useState([
        { value: -1, label: "" }
    ])
    const [optionsScooterSelect, setOptionsScooterSelect] = useState([
        { value: -1, label: "" }
    ])
    const optionsShowScooters = [
        { value: "0", label: "Patinetes Devolvidos" },
        { value: "1", label: "Patinetes Sendo Utilizados" },
    ]

    const [filtersMovements, setFiltersMovements] = useState({
        filterInitialDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
        filterFinalDate: String(today.getFullYear()) + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0'),
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
    const [showReturnData, setShowReturnData] = useState(false)
    const [shouldFilter, setShouldFilter] = useState({
        shouldFilterShowReturnedScooters: false,
        shouldFilterTypesMovement: false,
        shouldFilterShowJustOneOL: false,
        shouldFilterNamePeopleRegistration: false,
        shouldFilterByChassis: false
    })

    const formattingTime = (dateMovement, timeMovement) => {
        var dateSplited = dateMovement.split("-")
        var timeSplited = timeMovement.split(":")
        var dateMovementFormatted = new Date(dateSplited[0], dateSplited[1] - 1, dateSplited[2], timeSplited[0], timeSplited[1])
        var timeMovementFormatted = `${String(dateMovementFormatted.getHours()).padStart(2, '0')}:${String(dateMovementFormatted.getMinutes()).padStart(2, '0')}`
        return timeMovementFormatted
    }

    const getUniqueValues = (array, valueToCompare) => {
        const uniqueArray = array
            // store the comparison values in array
            .map(element => element[valueToCompare])
            // store the keys of the unique objects
            .map((element, index, final) => final.indexOf(element) === index && index)
            // eliminate the dead keys & store unique objects
            .filter(element => array[element])
            .map(element => array[element])
        
        return uniqueArray
    }

    useEffect(() => {
        if (movements !== undefined) {
            if (movements.length !== 0) {
                if (isDetails === false && isAdd === false) {
                    if (movements.map) {
                        movements.map(movement => {
                            movement.timePickUpFormatted = formattingTime(movement.intialDateMovement, movement.pickUpTime)
                            if (movement.returnTime !== null) movement.timeReturnFormatted = formattingTime(movement.intialDateMovement, movement.returnTime)
                            typesMovementsArray.push({
                                value: movement.typeMovement.id, label: movement.typeMovement.description
                            })
                            logisticsOperatorsArray.push({
                                value: movement.logisticOperator.id, label: movement.logisticOperator.description
                            })
                            if (movement.peopleRegistration !== null) {
                                deliverymanArray.push({
                                    value: movement.peopleRegistration.id, label: movement.peopleRegistration.name
                                })
                            }
                            scootersArray.push({
                                value: movement.scooter.id, label: movement.scooter.chassisNumber
                            })
                        })
                        setOptionsTypeMovementSelect(getUniqueValues(typesMovementsArray, "value"))
                        setOptionsLogisticOperatorSelect(getUniqueValues(logisticsOperatorsArray, "value"))
                        setOptionsDeliverymanSelect(getUniqueValues(deliverymanArray, "value"))
                        setOptionsScooterSelect(getUniqueValues(scootersArray, "value"))
                        setMovementState(movements)
                        setShouldGetMovements(false)
                    }
                }
                else setShouldGetMovements(true)
            }
            else {
                movements !== '' ? setShouldGetMovements(true) : setShouldGetMovements(false)
                setMovementState([{
                    id: 0, dataMovement: "", scooter: { chassisNumber: "" }, logisticOperator: { description: "" },
                    peopleRegistration: { name: "" }, typeRelease: "", accessoriesHelmet: false, accessoriesBag: false,
                    accessoriesCase: false, accessoriesCharger: false, observation: "", timePickUpFormatted: "", timeReturnFormatted: ""
                }])
            }
        }
        
        else {
            // api returns "" so if movements is empty is because there is not a movement in database
            movements !== '' ? setShouldGetMovements(true) : setShouldGetMovements(false)
            setMovementState([{
                id: 0, dataMovement: "", scooter: { chassisNumber: "" }, logisticOperator: { description: "" },
                peopleRegistration: { name: "" }, typeRelease: "", accessoriesHelmet: false, accessoriesBag: false,
                accessoriesCase: false, accessoriesCharger: false, observation: "", timePickUpFormatted: "", timeReturnFormatted: ""
            }])
        }
    }, [movements])

    useEffect(() => {
        if (scooters !== undefined) {
            if (scooters.length !== 0) {
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


    // FILTER THINGS
    const setFilteredMovementsToState = (arrayFilters) => {
        let filteredMovementsToState = [...movements]
        arrayFilters.forEach(filterObj => {
            if (filterObj.propertie === "returnTime") {
                if (filterObj.value === "!== null") {
                    filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.returnTime !== null))
                } else {
                    filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.returnTime === null))
                }
            } if (filterObj.propertie === "typeMovement.description") {
                filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.typeMovement.description === filterObj.value))
            } if (filterObj.propertie === "logisticOperator.description") {
               filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.logisticOperator.description === filterObj.value))
            } if (filterObj.propertie === "scooter.chassisNumber") {
               filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.scooter.chassisNumber === filterObj.value))
            } if (filterObj.propertie === "peopleRegistration.name") {
                filteredMovementsToState = filteredMovementsToState.filter(movementToFilter => (movementToFilter.peopleRegistration ? movementToFilter.peopleRegistration.name === filterObj.value : movementToFilter.peopleRegistration === filterObj.value))
            }
        })
        setMovementState(filteredMovementsToState)
    }

    useEffect(() => {
        valuesToFilterMovements = []
        if (movements !== '') {
            if (shouldFilter.shouldFilterShowReturnedScooters) {
                if (filtersMovements.filterShowReturnedScooters === "Patinetes Devolvidos") {
                    valuesToFilterMovements.push({ propertie: "returnTime", value: "!== null" })
                } if (filtersMovements.filterShowReturnedScooters === "Patinetes Sendo Utilizados") {
                    valuesToFilterMovements.push({ propertie: "returnTime", value: "=== null" })
                }   
            } if (shouldFilter.shouldFilterTypesMovement) {
                if (filtersMovements.filterTypesMovements !== "") {
                    valuesToFilterMovements.push({ propertie: "typeMovement.description", value: filtersMovements.filterTypesMovements })
                    filtersMovements.filterTypesMovements === "Interna" ? setShowReturnData(true) : setShowReturnData(false)
                }
            } if (!shouldFilter.shouldFilterTypesMovement) {
                setShowReturnData(false)
            } if (shouldFilter.shouldFilterShowJustOneOL) {
                if (filtersMovements.filterShowJustOneOL !== "") {
                    valuesToFilterMovements.push({ propertie: "logisticOperator.description", value: filtersMovements.filterShowJustOneOL })
                }
            } if (shouldFilter.shouldFilterNamePeopleRegistration) {
                if (filtersMovements.filterByNamePeopleRegistration !== "") {
                    valuesToFilterMovements.push({ propertie: "peopleRegistration.name", value: filtersMovements.filterByNamePeopleRegistration })
                }
            } if (shouldFilter.shouldFilterByChassis) {
                if (filtersMovements.filterByChassis !== "") {
                    valuesToFilterMovements.push({ propertie: "scooter.chassisNumber", value: filtersMovements.filterByChassis })
                }
            } if (valuesToFilterMovements.length === 0) {
                setMovementState(movements)
            } else {
                setFilteredMovementsToState(valuesToFilterMovements)
            }
        }
    }, [filtersMovements, shouldFilter])

    const handleFiltersChange = e => {
        const { name, value } = e.target
        setFiltersMovements({
            ...filtersMovements,
            [name]: value
        })
    }

    const hadleFilterSelectChange = (valueOfObject, objectWhoCalls) => {
        const { name } = objectWhoCalls
        let valueForFilter = ""
        if (objectWhoCalls.action === "select-option") valueForFilter = valueOfObject.label
        if (name === "filterShowReturnedScooters") {
            if (objectWhoCalls.action === "clear") {
                setShouldFilter({...shouldFilter, shouldFilterShowReturnedScooters: false})
                valueForFilter = "noValue"
            }
            else {
                setShouldFilter({ ...shouldFilter, shouldFilterShowReturnedScooters: true })
            }
        }
        if (name === "filterTypesMovements") {
            if (objectWhoCalls.action === "clear") {
                setShouldFilter({...shouldFilter, shouldFilterTypesMovement: false})
                valueForFilter = "noValue"
            }
            else {
                setShouldFilter({ ...shouldFilter, shouldFilterTypesMovement: true })
            }
        }
        if (name === "filterShowJustOneOL") {
            if (objectWhoCalls.action === "clear") {
                setShouldFilter({...shouldFilter, shouldFilterShowJustOneOL: false})
                valueForFilter = "noValue"
            }
            else {
                setShouldFilter({ ...shouldFilter, shouldFilterShowJustOneOL: true })
            }
        }
        if (name === "filterByNamePeopleRegistration") {
            if (objectWhoCalls.action === "clear") {
                setShouldFilter({...shouldFilter, shouldFilterNamePeopleRegistration: false})
                valueForFilter = "noValue"
            }
            else {
                setShouldFilter({ ...shouldFilter, shouldFilterNamePeopleRegistration: true })
            }
        }
        if (name === "filterByChassis") {
            if (objectWhoCalls.action === "clear") {
                setShouldFilter({...shouldFilter, shouldFilterByChassis: false})
                valueForFilter = "noValue"
            }
            else {
                setShouldFilter({ ...shouldFilter, shouldFilterByChassis: true })
            }
        }

        setFiltersMovements({
            ...filtersMovements,
            [name]: valueForFilter
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
            <div>
            <main className="content table">  
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patinetes</h1>
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
                                <label>Em uso</label>
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
                            <button onClick={handleSetFilters}>Filtrar Data</button>
                        </div>
                        <div className="filters">
                            <div className="field-box">
                                <label>Mostrar Apenas Patinetes</label>
                                <Select options={optionsShowScooters} name="filterShowReturnedScooters" onChange={hadleFilterSelectChange} styles={styleOfSelectFilter} isSearchable isClearable />
                            </div>
                            <div className="field-box">    
                                <label>Mostrar Apenas Movimentações do Tipo</label>
                                <Select options={optionsTypeMovementSelect} name="filterTypesMovements" onChange={hadleFilterSelectChange} styles={styleOfSelectFilter} isSearchable isClearable />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas a OL</label>
                                <Select options={optionsLogisticOperatorSelect} name="filterShowJustOneOL" onChange={hadleFilterSelectChange} styles={styleOfSelectFilter} isSearchable isClearable />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas o Entregador</label>
                                <Select options={optionsDeliverymanSelect} name="filterByNamePeopleRegistration" onChange={hadleFilterSelectChange} styles={styleOfSelectFilter} isSearchable isClearable />
                            </div>
                            <div className="field-box">
                                <label>Mostrar Apenas o Patinete</label>
                                <Select options={optionsScooterSelect} name="filterByChassis" onChange={hadleFilterSelectChange} styles={styleOfSelectFilter} isSearchable isClearable />
                            </div>
                        </div>
                        <hr />
                        <div className="table-responsive-vertical">
                            <table className="table-movements table-bordered table-striped table-mc-gray">
                                <thead>
                                    <tr>
                                        <th>Data Retirada</th>
                                        {showReturnData ? <th>Data Devolução</th> : <th className="hidden"></th>}
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
                                                showReturnData ? 
                                                <td data-title="Data Devolução" onClick={() => handleGoToDetails(movement.id)}>{movement.finalDateMovement}</td> :
                                                <td className="hidden"></td>
                                            }
                                            <td data-title="Hora Retirada">{movement.timePickUpFormatted}</td>
                                            <td data-title="Hora Devolução">{movement.timeReturnFormatted}</td>
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
            </main>
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
            </div>
        )
    }
    else {
        return (
            <main className="content table">
                <section className="section-main-box movement-section">
                    <div className="title-box">
                        <h1 className="title-page">Movimentações Patinetes</h1>
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
                                <label>Em uso</label>
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
                            <button onClick={handleSetFilters}>Filtrar Data</button>
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