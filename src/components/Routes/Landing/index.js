import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import Login from 'containers/Login'

const styles = ({
  
})

const Landing = (props) => {

  return(
    <div>
      <Login />
    </div>
  )
}

export default withStyles(styles)(Landing)
