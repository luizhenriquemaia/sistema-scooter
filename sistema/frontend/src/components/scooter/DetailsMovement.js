import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { addMovement, getMovement } from '../../actions/movement'


export default function Movement() {
    const params = useParams()
    const dispatch = useDispatch()
    const history = useHistory()
    const idMovementParams = params.idMovement
    const [idMovement, setIdMovement] = useState(-1)
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
    const movement = useSelector(state => state.movements.movement)

    useEffect(() => {
        if (idMovement != -1) dispatch(getMovement(idMovement))
    }, [idMovement])

    useEffect(() => {
        setIdMovement(idMovementParams)
    }, [idMovementParams])

    console.log(idMovement)
    console.log(movement)

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

    const redirectToRegister = e => {
        e.preventDefault()
        history.push('/register')
    }

    const handleSubmit = e => {
        e.preventDefault()
        const { scooter, cpfDeliveryman, typeMovement, destiny, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } = newMovementState
        const newMovement = { scooter, cpfDeliveryman, typeMovement, destiny, accessoriesHelmet, accessoriesBag, accessoriesCase, accessoriesCharger, observation } 
        dispatch(addMovement(newMovement))
    }

    console.log(newMovementState)


    return (
        <div className="content">
            <h1 className="title-page">Registro de movimentação de patinetes</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-input">
                    <label>Número do chassi</label>
                    <input type="text" name="scooter" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>CPF do Entregador</label>
                    <input type="text" name="cpfDeliveryman" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Retirada</label>
                    <input type="radio" name="typeMovement" value="retirada" onChange={handleChange} />
                    <label>Devolução</label>
                    <input type="radio" name="typeMovement" value="devolução" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Destino</label>
                    <input type="radio" name="destiny" value="base" onChange={handleChange} />
                    <input type="radio" name="destiny" value="manutenção" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <h4>Acessórios</h4>
                    <label>Capacete</label>
                    <input type="checkbox" name="accessoriesHelmet" onChange={handleCheck} />
                    <label>Bag</label>
                    <input type="checkbox" name="accessoriesBag" onChange={handleCheck} />
                    <label>Case</label>
                    <input type="checkbox" name="accessoriesCase" onChange={handleCheck} />
                    <label>Carregador</label>
                    <input type="checkbox" name="accessoriesCharger" onChange={handleCheck} />
                </div>
                <div className="form-input">
                    <label>Observação</label>
                    <textarea name="observation" onChange={handleChange}></textarea>
                </div>
                <button className="submit-button">Registrar</button>
                <button className="submit-button">Cancelar</button>
            </form>
        </div>
    )
}