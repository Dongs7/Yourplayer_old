import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import amber from '@material-ui/core/colors/amber';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  toast_root : {
    marginBottom:50
  },
  warning: {
    backgroundColor: amber[700],
  },
  anchorOriginBottomCenter :{
    bottom:150
  }
})

const Toast = (props) => {
  const { classes, open, toastMsg, handleCloseToast } = props
  // console.log(props)
  return (
    <div className={classes.toast_root}>
      <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          classes={{
            anchorOriginBottomCenter: classes.anchorOriginBottomCenter,

          }}
          open={open}
          onClose={handleCloseToast}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{toastMsg} is added to the playlist</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="secondary"
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
