// React things
import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Movement from './scooter/Movement'


export default function App() {
    return (
        <Router>
            <div className="container">
                <Switch>
                    <Route exact path="/" component={Movement} />
                </Switch>
            </div>
        </Router>
    )
}