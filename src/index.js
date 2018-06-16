import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

import CssBaseline from '@material-ui/core/CssBaseline'
import App from 'containers/App'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk';
import rootReducers from 'reducers'

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'


import registerServiceWorker from './registerServiceWorker'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['pID']
}
console.log(localStorage)
const persistedReducer = persistReducer(persistConfig, rootReducers)

export const store = createStore(persistedReducer,applyMiddleware(thunk))
let persistor = persistStore(store)
// const store = createStore(rootReducers,applyMiddleware(thunk))
const Test =() =>{
  console.log("loading")
  return(
  <div>
    <h2>...loading..</h2>
  </div>)
}
ReactDOM.render(
  <React.Fragment>
    <CssBaseline />
    <Provider store = { store }>
      <PersistGate loading={<Test/>} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.Fragment>
  , document.getElementById('root'));
registerServiceWorker();
