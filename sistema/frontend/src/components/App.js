// React things
import React, { Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Movement from './scooter/Movement'
import DetailsMovement from './scooter/DetailsMovement'
// Redux things
import { Provider } from 'react-redux'
import store from '../store'


export default function App() {
    return (
        <Provider store={store}>
                <Router>
                    <Fragment>
                        <div className="container">
                            <Switch>
                            <Route exact path="/" component={Movement} />
                            <Route exact path="/details-movement/:idMovement" component={DetailsMovement} />
                            </Switch>
                        </div>
                    </Fragment>
                </Router>
        </Provider>
    )
}