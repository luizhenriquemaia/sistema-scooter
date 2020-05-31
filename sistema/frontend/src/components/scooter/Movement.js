import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'


export default function Movement() {
    const [newMovement, setNewMovement] = useState({
        chassisNumber: "",
        OL: "",
        deliveryman: "",
        typeMovement: "",
        destiny: "",
        helmet: "",
        bag: "",
        case: "",
        charger: "",
        observation: ""
    })


    return (
        <div className="content">
            <h1 className="title-page">Registro de movimentação de patinetes</h1>
            <form >
                <div className="form-input">
                    <label>Número do chassi</label>
                    <input type="text"/>
                </div>
                <div className="form-input">
                    <label>Operador Logístico (OL)</label>
                    <input type="text"/>
                </div>
                <div className="form-input">
                    <label>Entregador</label>
                    <input type="text"/>
                </div>
                <div className="form-input">
                    <label>Retirada</label>
                    <input type="radio"/>
                    <label>Devolução</label>
                    <input type="radio" />
                </div>
                <div className="form-input">
                    <label>Destino</label>
                    <input type="radio" />
                    <input type="radio" />
                </div>
                <div className="form-input">
                    <h4>Acessórios</h4>
                    <label>Capacete</label>
                    <input type="checkbox"/>
                    <label>Bag</label>
                    <input type="checkbox"/>
                    <label>Case</label>
                    <input type="checkbox" />
                    <label>Carregador</label>
                    <input type="checkbox" />
                </div>
                <button className="submit-button">Registrar</button>
                <button className="submit-button">Cancelar</button>
            </form>
        </div>
    )
}