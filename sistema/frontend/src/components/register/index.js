import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { addPeopleRegistration, addLogisticOperator } from '../../actions/register'
import { getStatusScooters, addScooter } from '../../actions/scooters'


export default function Register() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [RegisterState, setRegisterState] = useState({
        logisticOperatorDescription: "",
        peopleRegistrationName: "",
        cpfPeopleRegistration: "",
        typePeople: "",
        logisticOperatorPeopleRegistration: "",
        chassisScooter: "",
        statusScooter: ""
    })
    const [statusScooterFromAPI, setStatusScooterFromAPI] = useState([{
        id: "",
        description: ""
    }])
    const [stateValueSelect, setStateValueSelect] = useState("delivery-man")

    useEffect(() => {
        dispatch(getStatusScooters())
    }, [])

    const statusScooter = useSelector(state => state.scooters.statusScooter)

    useEffect(() => {
        if (statusScooter !== undefined && statusScooter !== "") {
            setStatusScooterFromAPI(statusScooter)
        }
    }, [statusScooter])

    const handleChange = e => {
        const { name, value } = e.target
        setRegisterState({
            ...RegisterState,
            [name]: value
        })
        if (name === "register-type") {
            setStateValueSelect(value)
        }
    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setRegisterState({
            ...RegisterState,
            [name]: checked
        })
    }

    const handleClean = e => {
        setRegisterState({
            ...RegisterState,
            logisticOperatorDescription: "",
            peopleRegistrationName: "",
            cpfPeopleRegistration: "",
            typePeople: "",
            logisticOperatorPeopleRegistration: "",
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
                var typePeopleToAPI = "entregador"
                var newRegisterToAPI = { peopleRegistrationName, typePeopleToAPI, cpfPeopleRegistrationToAPI, logisticOperatorPeopleRegistration }
                dispatch(addPeopleRegistration(newRegisterToAPI))
                setRegisterState({
                    peopleRegistrationName: "",
                    cpfPeopleRegistration: "",
                    typePeople: "",
                    logisticOperatorPeopleRegistration: ""
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
                    setRegisterState({ logisticOperatorDescription: "" })
                }
            }
        else if (stateValueSelect === "scooter") {
                    const { chassisScooter, statusScooter } = RegisterState
                    if (chassisScooter === "") {
                        alert.error("preencha todos os campos")
                    }
                    else {
                        if (statusScooter !== "0" && statusScooter !== "") {
                            var newRegisterToAPI = { chassisScooter, statusScooter }
                            dispatch(addScooter(newRegisterToAPI))
                            setRegisterState({
                                ...RegisterState,
                                chassisScooter: "" 
                            })
                        }
                        else {
                            alert.error("Status Inválido")
                        }
                    }
                }
        else {
            alert.error("Tipo de Registro Inválido")
        }
    }
    

    return (
        <main className="content">
            <section className="register-section">
                <div className="titleBox">
                    <h1 className="title-page">Cadastros</h1>
                </div>
                <section className="register-content">
                    <div className="register-type">
                        <label>Tipo de cadastro</label>
                        <select name="register-type" onChange={handleChange}>
                            <option value="delivery-man">Entregador</option>
                            <option value="logistic-operator">Operador Oligstico</option>
                            <option value="scooter">Patinete</option>
                        </select>
                    </div>
                    <fieldset className={stateValueSelect ? `register-data-box ${stateValueSelect}` : "register-data-box"} >
                        <div className="register-data logistic-operator">
                            <label>Operador Logístico</label>
                            <input type="text" name="logisticOperatorDescription" value={RegisterState.logisticOperatorDescription || ''} onChange={handleChange} />
                        </div>
                        <div className="register-data delivery-man">
                            <label>CPF Entregador</label>
                            <input type="text" name="cpfPeopleRegistration" value={RegisterState.cpfPeopleRegistration || ''} onChange={handleChange} />
                            <label>Nome Entregador</label>
                            <input type="text" name="peopleRegistrationName" value={RegisterState.peopleRegistrationName || ''} onChange={handleChange} />
                            <label>OL do Entregador</label>
                            <input type="text" name="logisticOperatorPeopleRegistration" value={RegisterState.logisticOperatorPeopleRegistration || ''} onChange={handleChange} />
                        </div>
                        <div className="register-data scooter">
                            <label>Chassi Patinete</label>
                            <input type="text" name="chassisScooter" value={RegisterState.chassisScooter || ''} onChange={handleChange} />
                            <label>Status Patinete</label>
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