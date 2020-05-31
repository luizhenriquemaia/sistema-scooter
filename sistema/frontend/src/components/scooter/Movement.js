import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'


export default function Movement() {
    const [newMovement, setNewMovement] = useState({
        chassisNumber: "",
        OL: "",
        deliveryman: "",
        typeMovement: "",
        destiny: "",
        helmet: false,
        bag: false,
        case: false,
        charger: false,
        observation: ""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setNewMovement({
            ...newMovement,
            [name]: value
        })
    }

    const handleCheck = e => {
        const { name, checked } = e.target
        setNewMovement({
            ...newMovement,
            [name]: checked
        })
    }

    console.log(newMovement)


    return (
        <div className="content">
            <h1 className="title-page">Registro de movimentação de patinetes</h1>
            <form >
                <div className="form-input">
                    <label>Número do chassi</label>
                    <input type="text" name="chassisNumber" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Operador Logístico (OL)</label>
                    <input type="text" name="OL" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Entregador</label>
                    <input type="text" name="deliveryman" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Retirada</label>
                    <input type="radio" name="typeMovement" onChange={handleChange} />
                    <label>Devolução</label>
                    <input type="radio" name="typeMovement" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <label>Destino</label>
                    <input type="radio" name="destiny" onChange={handleChange} />
                    <input type="radio" name="destiny" onChange={handleChange} />
                </div>
                <div className="form-input">
                    <h4>Acessórios</h4>
                    <label>Capacete</label>
                    <input type="checkbox" name="helmet" onChange={handleCheck} />
                    <label>Bag</label>
                    <input type="checkbox" name="bag" onChange={handleCheck} />
                    <label>Case</label>
                    <input type="checkbox" name="case" onChange={handleCheck} />
                    <label>Carregador</label>
                    <input type="checkbox" name="charger" onChange={handleCheck} />
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