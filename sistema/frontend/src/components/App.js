// React things
import React, { Fragment } from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Movement from './scooter/Movement'
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
                            </Switch>
                        </div>
                    </Fragment>
                </Router>
        </Provider>
    )
}