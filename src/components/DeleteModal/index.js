import React from 'react'

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    textAlign: 'center',
    top: `50%`,
    left: `50%`,

    transform: `translate(-50%, -50%)`,
  },
  button:{
    margin: theme.spacing.unit,
  }
});


const DeleteModal = (props) => {
  // console.log(props.openState)
  const { classes, openState, handleModalClose, selectedID, removeItemFromList } = props
  // console.log(selectedID)
  return(
    <div style={{ border:'1px solid red'}}>
      <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openState}
          onClose={handleModalClose}
        >
          <div className={classes.paper}>
            <Typography variant="title" id="modal-title">
              Do you want to remove this song from the list?
            </Typography>
            <Button variant="outlined" color="secondary" className={classes.button} size="large" onClick = {()=>removeItemFromList(selectedID) }>REMOVE</Button>
            <Button variant='outlined' className={classes.button} onClick={ handleModalClose } size="large">CANCEL</Button>
          </div>
        </Modal>
    </div>
  )
}

export default withStyles(styles)(DeleteModal)
