export default function Register() {
    return (
        <main className="content">
            <section className="section-main-box register-section">
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
                        <div className="field-box user">
                            <label>Nome</label>
                            <input type="text" name="" onChange={handleChange} />
                            <label>Sobrenome</label>
                            <input type="text" name="" onChange={handleChange} />
                            <label>Base</label>
                            <select onChange={handleChange}>
                                <option value="">-----</option>
                                {/* {logisticOperatorFromAPI.map(logisitcOperator => (
                                    <option value={logisitcOperator.id} key={logisitcOperator.id}>{logisitcOperator.description}</option>
                                ))} */}
                            </select>
                        </div>
                        <div className="field-box">
                            <label>User name</label>
                            <input type="text" onChange={handleChange} />
                            <label>Senha</label>
                            <input type="text" onChange={handleChange} />
                            <label>Confirmação de senha</label>
                            <input type="text" onChange={handleChange} />
                        </div>
                    </fieldset>
                </section>
                <div className="buttonBox">
                    <button className="submit-button clean" onClick={handleClean}>Limpar</button>
                    <button className="submit-button confirm" onClick={handleClickAdd}>Registrar</button>
                </div>
            </section>
        </main>
    )};