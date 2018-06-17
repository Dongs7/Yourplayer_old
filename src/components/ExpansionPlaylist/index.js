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
  const { classes, user, isError,createChannel, createButtonState } = props
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
                isError.isError  === true?
                  isError.errMsg === 4 || isError.errMsg === 99?
                  <Button
                      size="large"
                      variant="raised"
                      onClick={
                        createButtonState ?
                        ()=>createChannel(2)
                        :
                        ()=>createChannel(1)
                      }>
                    {
                      createButtonState ?
                      `Reload your playlist`
                      :
                      `Create Youtube Channel`
                    }
                  </Button>
                  :
                  <Button size="large" variant="raised">Error other than 4</Button>
                :
                <Button size="large" variant="outlined" >No error</Button>
              :
              ''
            }
        </ExpansionPanelActions>
      </ExpansionPanel>

    </div>
  )
}

export default withStyles(styles)(ExpansionPlaylist)
