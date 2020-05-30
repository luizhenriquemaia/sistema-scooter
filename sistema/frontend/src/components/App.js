// React things
import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Home from './layout/Home'


export default function App() {
    return (
        <Router>
            <div className="container">
                <Switch>
                    <Route exact path="/" component={Home} />
                </Switch>
            </div>
        </Router>
    )
}