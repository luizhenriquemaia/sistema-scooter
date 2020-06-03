import React, { useEffect, useState } from 'react'


export default function Menu() {
return (
    <header>
        <nav className="menuBlock">
            <div className="userBlock">
                <div className="userBox">
                    <img src="# " />
                    <p>Admin</p>
                </div>
            </div>
            <hr />
            <div className="navBlock">
                <div className="navBox">
                    <img src="#" />
                    <p>cadastrar</p>
                </div>
                <div className="navBox">
                    <img src="#" />
                    <p>nova movimentação</p>
                    <div class="navSubBox">
                        <img src="#" />
                        <p>movimentação interna</p>
                    </div>
                    <div class="navSubBox">
                        <img src="#" />
                        <p>movimentação interna</p>
                    </div>
                    <div class="navSubBox">
                        <img src="#" />
                        <p>movimentação interna</p>
                    </div>
                </div>
                <div className="navBox">
                    <img src="#" />
                    <p>Registros</p>
                </div>
            </div>
        </nav>
    </header>
)};