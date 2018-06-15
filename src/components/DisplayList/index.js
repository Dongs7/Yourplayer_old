import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Badge from '@material-ui/core/Badge'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import PauseIcon from '@material-ui/icons/PauseCircleOutline'
import VolumnIcon from '@material-ui/icons/VolumeUp'
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'

import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import DeleteModal from 'components/DeleteModal'
import Toast from 'components/Toast'


const styles = theme => ({
  root : {
    flex : 1,
    width: '100%',
    backgroundColor: '#333',
  },
  grid_root : {
    maxWidth:1200,
    margin:'auto',
  },
  table_root:{
    border:'#ddd'
  },
  list_root:{
    backgroundColor:'#333'
  },
  result_title : {
    color:'#eee',
    fontSize:18,
    overflow:'hidden',
    textOverflow:'ellipsis',
    whiteSpace:'nowrap',
    [theme.breakpoints.down("767")]:{
      fontSize : 13
    }
  },
  playlist_title : {
    color:'#ddd',
    fontSize:20,
    textAlign:'center',
    fontFamily : 'Ubuntu'
  },
  icon_pointer : {
    cursor : 'pointer',
  },
  removeIcon : {
    [theme.breakpoints.down('767')]:{
      fontSize: 15
    }
  },
  removeIcon_rotate : {
    transform : 'rotate(90deg)'
  },
  playlist_cell : {
    paddingLeft : 0,
  },
  button: {
    marginRight: theme.spacing.unit,
    color:'#ddd'
  },
  hiddenIcon:{
    visibility:'hidden'
  },
  songtitle : {
  },
  listitem: {
    border:theme.palette.primary.main,
  },
  noresult_listitem:{
    justifyContent:'center'
  },

})

const DisplayList = (props) => {
  const { classes,
          isPlaylist,
          removeItem,
          modalState,
          checkRemoveID,
          data,
          selectedSong,
          currentPlayingSong,
          mouseOverOnRow,
          mouseLeaveOnRow,
          mouseState,
          playerControlFromDisplayList,
          playingState,
          addItemToList,
          handleModalClose,
          removeItemFromList,
          toasterState,
          handleCloseToast,
          toastContents
         } = props
  // console.log(data)
  return(
    <div className={classes.root}>
      {
        isPlaylist &&
        <DeleteModal
          selectedID ={ checkRemoveID }
          openState = { modalState }
          handleModalClose = { handleModalClose }
          removeItemFromList = { removeItemFromList }
        />
      }
      <Grid container className={classes.root}>
        <Grid container className={classes.grid_root}>
          <Grid item xs={12}>
            <List component="div" className={classes.list_root}>
              {
                // show title text and add_playlist icon when data.items are available
                isPlaylist ?
                (data.items && data.items.length > 0 ) ?
                  <ListItem>
                    <Chip
                      avatar={<Avatar> <Badge badgeContent={data.items.length} color="primary"><span style={{ display:'none'}}></span></Badge></Avatar>}
                      label="TOTAL SONGS IN THIS PLAYLIST"
                    />
                  </ListItem>
                  :
                  <ListItem>
                    <ListItemText disableTypography primary="" className={classes.playlist_title}/>
                  </ListItem>
                :
                 (data.items && data.items.length > 0 ) &&
                <ListItem>
                  <ListItemIcon className={classes.hiddenIcon}>
                    <AddIcon/>
                  </ListItemIcon>
                  <ListItemText disableTypography primary="TITLE" className={classes.playlist_title}/>
                  {
                    // show add icon in the result list only
                    !isPlaylist &&
                    <ListItemIcon className={classes.button}>
                      <PlaylistAddIcon/>
                    </ListItemIcon>
                  }
                </ListItem>
              }

              {
                data.items ?
                data.items.length <= 0 ?
                <ListItem>
                  <Typography style={{ color:'#ddd', fontSize:15}}>No Songs in your playlist</Typography>
                </ListItem>
                :

                data.items.map(n => {
                  let videoId = n.id.videoId ? n.id.videoId : n.snippet.resourceId.videoId
                  let longtitle = n.snippet.title
                  // Try to get rid of useless characters from the title
                  let trimTitle = longtitle.replace(/\[.*?\]|《.*?》|@(.*)|\(.*?\)|\|(.*)|(\s?)MV(\s?)/g,"")
                  return(

                      <ListItem divider button key={videoId} id={videoId} onMouseOver={(e)=>mouseOverOnRow(e,videoId)} onMouseLeave={mouseLeaveOnRow}>
                        {
                          isPlaylist ?
                          <ListItemIcon className={classes.button} aria-label="remove" color="secondary">
                            <RemoveIcon id={n.id} className={classNames(classes.removeIcon,classes.icon_pointer, {[classes.removeIcon_rotate] : checkRemoveID === n.id })} onClick={ removeItem }/>
                          </ListItemIcon>
                          :
                           mouseState === videoId ?
                              currentPlayingSong === videoId ?
                                playingState ?
                                              <ListItemIcon className={classes.button} aria-label="pause" color="secondary">
                                                <PauseIcon onClick={()=>playerControlFromDisplayList('pause')}/>
                                              </ListItemIcon>
                                             :
                                             <ListItemIcon className={classes.button} aria-label="play" color="secondary">
                                               <PlayIcon onClick={()=>playerControlFromDisplayList('play')}/>
                                             </ListItemIcon>
                              :
                              <ListItemIcon className={classes.button} aria-label="play" color="secondary">
                                <PlayIcon onClick={()=>playerControlFromDisplayList('play', videoId, trimTitle)}/>
                              </ListItemIcon>
                          :
                          currentPlayingSong === videoId ?
                          <ListItemIcon className={classes.button} aria-label="vol" color="secondary">
                           <VolumnIcon />
                          </ListItemIcon>
                          :
                          <ListItemIcon className={classes.button} aria-label="play" color="secondary">
                            <PlayIcon  className={classes.hiddenIcon}/>
                          </ListItemIcon>

                        }
                        <ListItemText disableTypography className={classes.result_title} primary={trimTitle} onClick={()=>selectedSong(videoId,trimTitle)} />
                      {
                        !isPlaylist &&
                        <ListItemIcon className={classes.button} onClick={()=>addItemToList(videoId, trimTitle)}>
                          <AddIcon/>
                        </ListItemIcon>
                      }
                      </ListItem>
                )
                })
                :
                <ListItem className={classes.noresult_listitem}>
                  {
                    isPlaylist ?
                    <Typography style={{ color:'#ddd', fontSize:15}}>Fail to fetch items from the playlist. If this is your first time using this player, we'll create the playlist for you. Otherwise, we'll reload your playlist. Click the button below to solve problems.</Typography>
                    :
                    <Typography style={{ color:'#ddd', fontSize:44}}>No Search Results</Typography>
                  }

                </ListItem>
              }

            </List>
          </Grid>
        </Grid>
      </Grid>
      {
        !isPlaylist &&
        <Toast
          open={toasterState}
          handleCloseToast = { handleCloseToast }
          toastContents = { toastContents }/>
      }

    </div>
  )
}



export default withStyles(styles)(DisplayList)
