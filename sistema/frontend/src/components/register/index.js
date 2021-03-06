import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { addPeopleRegistration } from '../../actions/peopleRegistration'
import { getLogisticOperator, addLogisticOperator } from '../../actions/logisticOperator'
import { getStatusScooters, addScooter } from '../../actions/scooters'


export default function Register() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [RegisterState, setRegisterState] = useState({
        logisticOperatorDescription: "",
        peopleRegistrationName: "",
        cpfPeopleRegistration: "",
        logisticOperatorPeopleRegistration: "",
        chassisScooter: "",
        statusScooter: ""
    })
    const [statusScooterFromAPI, setStatusScooterFromAPI] = useState([{
        id: "",
        description: ""
    }])
    const [logisticOperatorFromAPI, setLogisticOperatorFromAPI] = useState([{
        id: "",
        description: ""
    }])
    const [stateValueSelect, setStateValueSelect] = useState("logistic-operator")
    const logisticOperator = useSelector(state => state.logisticOperator ? state.logisticOperator.logisticOperator : state.logisticOperator)
    const statusScooter = useSelector(state => state.scooters ? state.scooters.statusScooter : state.scooters)
    const wasLOAdded = useSelector(state => state.logisticOperator.wasAdded)
    
    useEffect(() => {
        dispatch(getStatusScooters())
        dispatch(getLogisticOperator())
    }, [])

    useEffect(() => {
        if (wasLOAdded) dispatch(getLogisticOperator())
    }, [wasLOAdded])


    useEffect(() => {
        if (statusScooter !== undefined && statusScooter !== "") {
            setStatusScooterFromAPI(
                statusScooter.filter(status => (status.description !== "Em uso" && status.description !== "Manutenção"))
            )
        }
    }, [statusScooter])

    useEffect(() => {
        if (logisticOperator !== undefined && logisticOperator !== "") {
            if (!wasLOAdded) {
                setLogisticOperatorFromAPI(logisticOperator)
            }
        }
    }, [logisticOperator])

    const handleChange = e => {
        const { name, value } = e.target
        if (name === "register-type") {
            setStateValueSelect(value)
        }
        else {
            setRegisterState({
                ...RegisterState,
                [name]: value
            })
        }
    }

    const handleClean = e => {
        setRegisterState({
            ...RegisterState,
            logisticOperatorDescription: "",
            peopleRegistrationName: "",
            cpfPeopleRegistration: "",
            chassisScooter: "",
            statusScooter: ""
        })
    }

    const handleClickAdd = e => {
        if (stateValueSelect === "delivery-man") {
            const { peopleRegistrationName, cpfPeopleRegistration, logisticOperatorPeopleRegistration } = RegisterState
            const cpfPeopleRegistrationToAPI = cpfPeopleRegistration.replace(/\D/g, '')
            if (cpfPeopleRegistrationToAPI.length !== 11) {
                alert.error("cpf inválido")
            }
            else if (peopleRegistrationName === "" || logisticOperatorPeopleRegistration === "") {
                alert.error("preencha todos os campos")
            }
            else {
                var newRegisterToAPI = { peopleRegistrationName, cpfPeopleRegistrationToAPI, logisticOperatorPeopleRegistration }
                dispatch(addPeopleRegistration(newRegisterToAPI))
                setRegisterState({
                    ...RegisterState,
                    peopleRegistrationName: "",
                    cpfPeopleRegistration: "",
                })
            }
        }
        else if (stateValueSelect === "logistic-operator") {
                const { logisticOperatorDescription } = RegisterState
                if (logisticOperatorDescription === "") {
                    alert.error("preencha todos os campos")
                }
                else {
                    var newRegisterToAPI = { stateValueSelect, logisticOperatorDescription }
                    dispatch(addLogisticOperator(newRegisterToAPI))
                    setRegisterState({ 
                        ...RegisterState,
                        logisticOperatorDescription: "" 
                    })
                }
            }
        else if (stateValueSelect === "scooter") {
                    const { chassisScooter, statusScooter } = RegisterState
                    if (chassisScooter === "") {
                        return alert.error("preencha todos os campos")
                    }
                    else {
                        if (chassisScooter.toString().length < 4) {
                            return alert.error("o chassi deve ter pelo menos 4 dígitos")
                        }
                        if (statusScooter !== "0" && statusScooter !== "") {
                            var newRegisterToAPI = { chassisScooter, statusScooter }
                            dispatch(addScooter(newRegisterToAPI))
                            setRegisterState({
                                ...RegisterState,
                                chassisScooter: "" 
                            })
                        }
                        else {
                            return alert.error("Status Inválido")
                        }
                    }
                }
        else {
            return alert.error("Tipo de Registro Inválido")
        }
    }


    return (
        <main className="content">
            <section className="section-main-box register-section">
                <div className="title-box">
                    <h1 className="title-page">Cadastrar</h1>
                </div>
                <section className="content-box">
                    <div className="register-type">
                        <label>Tipo de Cadastro</label>
                        <select name="register-type" onChange={handleChange}>
                            <option value="logistic-operator">Operador Logístico</option>
                            <option value="delivery-man">Entregador</option>
                            <option value="scooter">Patinete</option>
                        </select>
                    </div>
                    <fieldset className={stateValueSelect ? `data-box ${stateValueSelect}` : "data-box"} >
                        <div className="field-box logistic-operator">
                            <label>Operador Logístico</label>
                            <input type="text" name="logisticOperatorDescription" value={RegisterState.logisticOperatorDescription || ''} onChange={handleChange} />
                        </div>
                        <div className="field-box delivery-man">
                            <label>Nome</label>
                            <input type="text" name="peopleRegistrationName" value={RegisterState.peopleRegistrationName || ''} onChange={handleChange} />
                            <label>CPF</label>
                            <input type="text" name="cpfPeopleRegistration" value={RegisterState.cpfPeopleRegistration || ''} onChange={handleChange} />
                            <label>Operador Logístico</label>
                            <select name="logisticOperatorPeopleRegistration" onChange={handleChange}>
                                <option value="">-----</option>
                                {logisticOperatorFromAPI.map(logisitcOperator => (
                                    <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field-box scooter">
                            <label>Chassi</label>
                            <input type="text" name="chassisScooter" value={RegisterState.chassisScooter || ''} onChange={handleChange} />
                            <label>Status</label>
                            <select name="statusScooter" onChange={handleChange} >
                                <option value="0">-----</option>
                                {statusScooterFromAPI.map(status => (
                                    <option value={status.id} key={status.id}>{status.description}</option>
                                ))}
                            </select>
                        </div>
                    </fieldset>
                </section>
                <div className="buttonBox">
                    <button className="submit-button clean" onClick={handleClean}>Limpar</button>
                    <button className="submit-button confirm" onClick={handleClickAdd}>Registrar</button>
                </div>
            </section>
        </main>
    )
}