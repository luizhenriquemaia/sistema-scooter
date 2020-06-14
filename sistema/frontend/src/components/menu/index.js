import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Menu() {

    const [isOpenMenuState, setIsOpenMenuState] = useState(true)

    return (
        <header>
            <nav className={isOpenMenuState ? "menuBlock" : "menuBlock closedMenu"}>
                <div className="menuIconBox">
                    <span onClick={() => setIsOpenMenuState(!isOpenMenuState)}></span>
                </div>
                <hr />
                <div className="navBlock"> 
                    <div className="userBox">
                        <img src='../../../static/imgs/mulher_1.png'/>
                        <p>Admin</p>
                        <img className="exit-img" src='../../../static/imgs/sair.png'/>
                    </div>
                    <hr />
                    <Link to="/register">
                        <div className="navBox">
                            <img src='../../../static/imgs/cadastrar_1.png'/>
                            <p>cadastrar</p>
                        </div>
                    </Link>
                    <Link to="./add-movement">
                        <div className="navBox">
                            <img src="../../../static/imgs/adicionar_1.png" />
                            <p>nova movimentação</p>
                        </div>
                    </Link>
                    <Link to="/">    
                        <div className="navBox">
                            <img src="../../../static/imgs/lista-de-controle_1.png" />
                            <p>Registros</p>
                        </div>
                    </Link>
                </div>
            </nav>
        </header>
    )
};