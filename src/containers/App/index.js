import React, { Component } from 'react'

import { BrowserRouter as Router, Route } from 'react-router-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from 'config'
import { connect } from 'react-redux'

//Routes
import Main from 'components/Routes/Main'

import Layout from 'containers/Layout'
// dev only
import { hot } from 'react-hot-loader'


class App extends Component {
  

  render(){
    return(
      <MuiThemeProvider theme={theme}>
        <Router>
          <Layout>
            <Route exact path='/' component={Main} />
          </Layout>
        </Router>
      </MuiThemeProvider>
    )
  }
}

// Get current user info
const mapStateToProps = (state) => {
  return{
    userState : state.userRed
  }
}

export default hot(module)(connect(mapStateToProps)(App))
