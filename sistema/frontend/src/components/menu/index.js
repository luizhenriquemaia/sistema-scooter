import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import { logoutUser } from '../../actions/auth'

export default function Menu() {
    const dispatch = useDispatch()

    const [isOpenMenuState, setIsOpenMenuState] = useState(true)
    const isAuthenticated = useSelector(state => state.auth.isAuthenticated)

    const handleLogoutClick = e => {
        e.preventDefault()
        dispatch(logoutUser())
    }

    if (isAuthenticated) {
        return (
            <header>
                <nav className={isOpenMenuState ? "menuBlock" : "menuBlock closedMenu"}>
                    <div className="menuIconBox">
                        <span onClick={() => setIsOpenMenuState(!isOpenMenuState)}></span>
                    </div>
                    <hr />
                    <div className="navBlock">
                        <div className="userBox">
                            <img src='../../../static/imgs/mulher_1.png' />
                            <p>Admin</p>
                            <img className="exit-img" onClick={handleLogoutClick} src='../../../static/imgs/sair.png' />
                        </div>
                        <hr />
                        <Link to="/user-register">
                            <div className="navBox">
                                <img src='../../../static/imgs/add.png' />
                                <p>cadastrar usuários</p>
                            </div>
                        </Link>
                        <Link to="/register">
                            <div className="navBox">
                                <img src='../../../static/imgs/cadastrar_1.png' />
                                <p>cadastrar patinetes</p>
                            </div>
                        </Link>
                        <Link to="/add-movement">
                            <div className="navBox">
                                <img src="../../../static/imgs/adicionar_1.png" />
                                <p>Nova Movimentação</p>
                            </div>
                        </Link>
                        <Link to="/">
                            <div className="navBox">
                                <img src="../../../static/imgs/lista-de-controle_1.png" />
                                <p>Movimentações</p>
                            </div>
                        </Link>
                    </div>
                </nav>
            </header>
        )
    } else {
        return (
            <header></header>
        )
    }
    
};