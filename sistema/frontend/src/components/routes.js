import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router-dom'
import movements from './movements'
import addMovement from './addMovement'
import detailsMovement from './detailsMovement'
import Login from './login'
import Register from './register'
import userRegister from './userRegister'


const PrivateRoute = ({ component, ...options }) => {
    const auth = useSelector(state => state.auth)
    return (
        <Route
            {...options}
            render={props => {
                if (auth.isLoading) {
                    return <h2>Loading...</h2>
                } else if (!auth.isAuthenticated) {
                    return <Redirect to="/login" />
                } else {
                    return <Route {...options} component={component} />
                }
            }}
        />
    )
    
}


export default function Routes() {
    return (    
        <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={movements} />
            <PrivateRoute exact path="/add-movement" component={addMovement} />
            <PrivateRoute exact path="/details-movement/:idMovement" component={detailsMovement} />
            <PrivateRoute exact path="/register" component={Register} />
            <PrivateRoute exact path="/user-register" component={userRegister} />
        </Switch>
    )
}