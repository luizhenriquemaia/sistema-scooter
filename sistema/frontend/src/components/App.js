// React things
import React, { Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Menu from './menu'
import Movement from './scooter/Movement'
import DetailsMovement from './scooter/DetailsMovement'
import Register from './register'
// Redux things
import { Provider } from 'react-redux'
import store from '../store'


export default function App() {
    return (
        <Provider store={store}>
                <Router>
                    <Fragment>
                    <Menu/>
                        <div className="container">
                            <Switch>
                            <Route exact path="/" exact component={Movement} />
                            <Route exact path="/details-movement/:idMovement" component={DetailsMovement} />
                            <Route exact path="/register" component={Register} />
                            </Switch>
                        </div>
                    </Fragment>
                </Router>
        </Provider>
    )
}