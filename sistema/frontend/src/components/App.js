import React, { Fragment, useEffect } from 'react'
import { HashRouter as Router} from 'react-router-dom'
import Alerts from './alerts'
import Menu from './menu'
import { Provider } from 'react-redux'
import store from '../store'
import { Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic'
import Routes from './routes'
import { loadUser } from '../actions/auth'



const alertOptions = {
    timeout: 3000,
    position: 'top center'
}


export default function App() {
    useEffect(() => {
        store.dispatch(loadUser())
    }, [])

    return (
        <Provider store={store}>
            <AlertProvider template={AlertTemplate} {...alertOptions}>
                <Router>
                    <Fragment>
                        <Alerts />
                        <Menu />
                        <div className="container">
                            <Routes />
                        </div>
                    </Fragment>
                </Router>
            </AlertProvider>
        </Provider>
    )
}