import React from 'react'

import { withStyles } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import ResultList from 'containers/ResultList'

const styles = theme => ({
  root: {
    width: '100%',
    overflow :'hidden'
  },
  panel_root : {
    backgroundColor:'#333'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    color:'#fff'
  },
})

const ExpansionPlaylist = (props) => {
  const { classes, user, plistId, playlistCreator } = props
  // console.log(plistId , ' from EXPANSIONLIST')
  return(
    <div className={classes.root}>
      <ExpansionPanel expanded className={classes.panel_root}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>
            {
              user ?
                `${user.displayName} 's `
                :
                ''
            }
            PLAYLIST
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          {/* <Typography>
            added songs go in here
          </Typography> */}
          {
            user ?
              <ResultList forPlaylist/>
              :
              'Log In'
          }

        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>

            {
              user ?
                plistId !== '' ? <Button size="small" color="secondary"> SAVE </Button>
                : <Button size="small" color="primary" onClick={playlistCreator}> CREATE PLAYLIST </Button>
              :
              <Button size="small" color="secondary" disabled fullWidth> LOG IN TO USE PLAYLIST</Button>
            }

        </ExpansionPanelActions>
      </ExpansionPanel>

    </div>
  )
}

export default withStyles(styles)(ExpansionPlaylist)
