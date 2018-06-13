import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import AddIcon from '@material-ui/icons/AddCircleOutline'
import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import PauseIcon from '@material-ui/icons/PauseCircleOutline'
import VolumnIcon from '@material-ui/icons/VolumeUp'
import RemoveIcon from '@material-ui/icons/RemoveCircleOutline'

import IconButton from '@material-ui/core/IconButton';

import DeleteModal from 'components/DeleteModal'
import Toast from 'components/Toast'



const CustomTableCell = withStyles(theme => ({
  head:{
    color: theme.palette.common.white,
    fontSize: 20,
  },
  body: {
    // fontSize: 14,
    color: theme.palette.common.white,
    // border:'1px solid red'
    borderBottom:'1px solid #333'
  },
}))(TableCell);


const styles = theme => ({
  root : {
    // flexGrow : 1
  },
  grid_root : {
    maxWidth:1200,
    margin:'auto',
    // border:'1px solid white'
    // color:'#fff'
  },
  hiddenIcon : {
    visibility: 'hidden'
  },
  table_root:{
    // width:'100%'
    border:'#ddd'
  },
  result_title : {
    color:'#fff',
    fontSize:18,
    [theme.breakpoints.down("767")]:{
      fontSize : 10
    }
  },
  playlist_title : {
    color:'#fff',
    fontSize:14
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
    paddingLeft : 0
  },
  button: {
    marginRight: theme.spacing.unit,
    color:'#fff',
    // border:'1px solid white'
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
          titleTobeAdded
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
      <Grid container>
        <Grid container className={classes.grid_root}>
          <Grid item xs={12}>
            <Table className={classes.table_root}>
              <TableHead>
                <TableRow>

                    <CustomTableCell colSpan={isPlaylist ? "3" : "1"} >Song Title</CustomTableCell>
                  {
                    !isPlaylist &&
                    <CustomTableCell>Add</CustomTableCell>
                  }

                </TableRow>
              </TableHead>
              <TableBody>
                {

                  data.items ?
                  data.items.map(n => {
                    let videoId = n.id.videoId ? n.id.videoId : n.snippet.resourceId.videoId
                    let videoTitle = n.snippet.title
                    return(
                      <TableRow key={videoId} id={videoId} onMouseOver={(e)=>mouseOverOnRow(e,videoId)} onMouseLeave={mouseLeaveOnRow}>
                        {/* {
                          !isPlaylist &&
                          <CustomTableCell className={classes.playlist_cell}>
                          { mouseState === videoId ?
                              currentPlayingSong === videoId ?
                                playingState ? <PauseIcon onClick={()=>playerControlFromDisplayList('pause')}/> : <PlayIcon onClick={()=>playerControlFromDisplayList('play')}/>
                                             : <PlayIcon onClick={()=>selectedSong(videoId)}/>
                              :
                              currentPlayingSong === videoId ? <VolumnIcon /> :  <PlayIcon  className={classes.hiddenIcon}/>
                          }
                          </CustomTableCell>
                        } */}

                          <CustomTableCell scope="row" className={classes.playlist_cell}>

                            <Typography className={classNames({[classes.result_title] : !isPlaylist},
                                                              {[classes.playlist_title] : isPlaylist})} noWrap={isPlaylist ? true : false}>
                              {
                                isPlaylist ?
                                <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                  <RemoveIcon id={n.id} className={classNames(classes.removeIcon,classes.icon_pointer, {[classes.removeIcon_rotate] : checkRemoveID === n.id })} onClick={ removeItem }/>
                                </IconButton>
                                :
                                 mouseState === videoId ?
                                    currentPlayingSong === videoId ?
                                      playingState ?
                                                    <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                                      <PauseIcon onClick={()=>playerControlFromDisplayList('pause')}/>
                                                    </IconButton>
                                                   :
                                                   <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                                     <PlayIcon onClick={()=>playerControlFromDisplayList('play')}/>
                                                   </IconButton>
                                    :
                                    <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                      <PlayIcon onClick={()=>selectedSong(videoId)}/>
                                    </IconButton>
                                :
                                currentPlayingSong === videoId ?
                                <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                 <VolumnIcon />
                                </IconButton>
                                :
                                <IconButton className={classes.button} aria-label="Delete" color="secondary">
                                  <PlayIcon  className={classes.hiddenIcon}/>
                                </IconButton>

                              }
                              <span onClick={()=>selectedSong(videoId)}> {n.snippet.title}</span>
                            </Typography>

                          </CustomTableCell>

                        {
                          !isPlaylist &&
                          <CustomTableCell><AddIcon className={classes.icon_pointer} onClick={()=>addItemToList(videoId, videoTitle)}/></CustomTableCell>
                        }

                      </TableRow>
                    )
                  })

                  :
                  <TableRow >
                    {
                      isPlaylist ?
                      <CustomTableCell component="th" scope="row" colSpan="1"> No Songs in this playlist </CustomTableCell>
                      :
                      <CustomTableCell component="th" scope="row" colSpan="3"> No Search Results </CustomTableCell>
                    }

                  </TableRow>
                }
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Grid>

      <Toast
        open={toasterState}
        handleCloseToast = { handleCloseToast }
        toastMsg = { titleTobeAdded }/>
    </div>
  )
}



export default withStyles(styles)(DisplayList)
