import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { getBases } from '../../actions/bases'
import { addEmployee } from '../../actions/auth'

    

export default function userRegisterComponent() {
    const dispatch = useDispatch()
    const alert = useAlert()
    const [newUserState, setNewUserState] = useState({
        firstName: "",
        lastName: "",
        base: "",
        username: "",
        password: "",
        password2: ""
    })
    const [basesFromAPI, setBasesFromAPI] = useState([{
        id: "",
        description: ""
    }])

    useEffect(() => {
       dispatch(getBases())
    }, [])

     const basesOfWork = useSelector(state => state.bases.base)

    useEffect(() => {
        if (basesOfWork !== undefined && basesOfWork !== "" && basesOfWork !== null) {
            setBasesFromAPI(basesOfWork)
        }
    }, [basesOfWork])


    const handleChange = e => {
        const { name, value } = e.target
        setNewUserState({
            ...newUserState,
            [name]: value
        })
    }

    const handleClean = e => {
        setNewUserState({
            ...newUserState,
            firstName: "",
            lastName: "",
            username: "",
            password: "",
            password2: ""
        })
    }

    const handleClickAdd = e => {
        const { firstName, lastName, base, username, password, password2 } = newUserState
        if (firstName === "" || lastName === "" || username === "" || password === "" || password2 === "") {
            alert.error("preencha todos os campos")
        } else {
            if (password !== password2) {
                alert.error("senhas não coincidem")
            } else {
                if (base === "") {
                    alert.error("selecione uma base válida")
                } else {
                    var newEmployeeData = { firstName, lastName, base, username, password }
                    dispatch(addEmployee(newEmployeeData))
                }
            }
        }
    }

    return (
        <main className="content">
            <section className="section-main-box user-section">
                <div className="title-box">
                    <h1 className="title-page">Cadastro de Usuários</h1>
                </div>
                <section className="content-box">
                    {/* <div className="register-type">
                        <label>Tipo de Cadastro</label>
                        <select name="register-type" onChange={handleChange}>
                            <option value="logistic-operator">Usuário</option>
                            <option value="delivery-man">Entregador</option>
                            <option value="scooter">Patinete</option>
                        </select>
                    </div> */}
                    <fieldset className="data-box" >
                        <div className="field-box user personal-data">
                            <label>Nome</label>
                            <input type="text" name="firstName" onChange={handleChange} value={newUserState.firstName} />
                            <label>Sobrenome</label>
                            <input type="text" name="lastName" onChange={handleChange} value={newUserState.lastName} />
                            <label>Base</label>
                            <select name= "base" onChange={handleChange} value={newUserState.base} >
                                <option value="">-----</option>
                                {basesFromAPI.map(base => (
                                    <option value={base.id} key={base.id}>{base.description}</option>
                                ))}
                            </select>
                        </div>
                        <div className="field-box user register-data">
                            <label>User name</label>
                            <input type="text" name="username" onChange={handleChange} value={newUserState.username} />
                            <label>Senha</label>
                            <input type="password" name="password" onChange={handleChange} value={newUserState.password} />
                            <label>Confirmação de senha</label>
                            <input type="password" name="password2" onChange={handleChange} value={newUserState.password2} />
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