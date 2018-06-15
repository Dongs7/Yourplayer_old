import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import ErrorIcon from '@material-ui/icons/ErrorOutline'
import OkIcon from '@material-ui/icons/CheckCircle'
import CloseIcon from '@material-ui/icons/Close'

const styles = theme => ({
  bg_color:{
    backgroundColor: theme.palette.primary.main,
  },
  bg_warning:{
    backgroundColor : theme.palette.error.dark
  },
  msg_font:{
    fontSize : 17
  },
  anchorOriginBottomCenter :{
    bottom:150
  },
  center:{
    textAlign : 'center'
  },
  margin : {
    margin: theme.spacing.unit * 2
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

const Toast = (props) => {
  const { classes, open, toastContents, handleCloseToast } = props
  return (
    <div>
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          autoHideDuration={3000}
          classes={{
            anchorOriginBottomCenter: classes.anchorOriginBottomCenter,
          }}
          open={open}
          onClose={handleCloseToast}
          ContentProps={{
            'aria-describedby': 'message-id',
            classes: {
                       root : toastContents.error ? classes.bg_warning : classes.bg_color,
                       message: classes.msg_font
                     }
          }}
          message={
                    toastContents.error ?
                    <span id="message-id" className={classes.message}>
                      <ErrorIcon className={classes.margin}/>{toastContents.text}
                    </span>
                    :
                    <span id="message-id" className={classes.message}>
                      <OkIcon className={classes.margin}/>{toastContents.text}
                    </span>
                  }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={handleCloseToast}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
    </div>
  )
}

export default withStyles(styles)(Toast)
