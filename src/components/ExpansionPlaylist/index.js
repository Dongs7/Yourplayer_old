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
  divider_color : {
    backgroundColor : theme.palette.primary.main
  }
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
          {
            user ?
              <ResultList forPlaylist/>
              :
              <Button size="large" fullWidth disabled variant="flat">
                <span style={{ color:'#fff'}}>SIGN IN TO USE PLAYLIST </span>
              </Button>
          }

        </ExpansionPanelDetails>
        <Divider
          classes ={{ root: classes.divider_color}}/>
        <ExpansionPanelActions>
            {
              user  ?
                plistId !== '' ? <Button size="small" color="primary" variant="raised" onClick={playlistCreator}> Reload Playlist </Button>
                :
                <Button size="small" color="primary" variant="raised" onClick={playlistCreator}> Solve Playlist issues </Button>
              :
              ''
            }
        </ExpansionPanelActions>
      </ExpansionPanel>

    </div>
  )
}

export default withStyles(styles)(ExpansionPlaylist)
