import React, { Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import Alerts from './alerts'
import Menu from './menu'
import Movement from './scooter/Movement'
import DetailsMovement from './scooter/DetailsMovement'
import Register from './register'
import { Provider } from 'react-redux'
import store from '../store'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'



const alertOptions = {
    timeout: 3000,
    position: 'top center'
}


export default function App() {
    return (
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <Router>
                    <Fragment>
                        <Alerts />
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
            </AlertProvider>
        </Provider>
    )
}