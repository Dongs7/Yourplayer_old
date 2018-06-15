import React from 'react'

import { withStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import Sliders from 'components/Slider'

import PlayIcon from '@material-ui/icons/PlayCircleOutline'
import PauseIcon from '@material-ui/icons/PauseCircleOutline'
import SkipPrevIcon from '@material-ui/icons/SkipPrevious'
import SkipNextIcon from '@material-ui/icons/SkipNext'
import RepeatIcon from '@material-ui/icons/Repeat'
import RepeatOneIcon from '@material-ui/icons/RepeatOne'
import ShuffleIcon from '@material-ui/icons/Shuffle'

import Typography from '@material-ui/core/Typography'



import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

const styles = theme =>({
  root : {
    display:'flex',
    flexDirection:'column',
    flexGrow:1,
    height:'100%',

  },
  controlWrapper : {
    display:'flex',
    flexDirection:'row',
    height:'100%',
  },

  playerControl : {
    display:'flex',
    flex:1,
    flexDirection:'column',
    alignItems:'center',
  },
  icons: {
    fontSize:30
  },
  title: {
    color:'#fff'
  },
  slider : {
    maxWidth: 500,
    width:'80%',
    marginLeft:'15%',
    marginRight:'15%',
    // border:'1px solid white',
    flexGrow:1
  },
  repeatAll : {
    color:'green'
  },
  repeatOne:{
    color:'magenta'
  },
  bn_root:{
    display:'flex',
    // flexDirection:'row',
    // flex:1,
    width:'100%',
    // [theme.breakpoints.down("sm")]:{
    //   width:'calc(100% - 15px)'
    // },

    backgroundColor:'#333',
  },
  bn_action:{
    color:'#fff',
    // padding:0,
    [theme.breakpoints.down("sm")]:{
      minWidth:'20%'
    }

  },
   test: {
     // border:'1px solid white',
     flexGrow:1
   }
})

const PlayerController = (props) => {
  const { classes,
          playState,
          controlFromPlayer,
          currentSongTitle,
          currentSongDuration,
          currentPosition,
          playerRepeatStatus,
          currentRepeatStatus,
          changeTrack,
          seekSong,
          sliderChangeStart,
          sliderChangeEnd,
          sliderState,
          sliderValueWhileChanging
        } = props
  // console.log(currentRepeatStatus)
  return(
    <div id="controller" className={classes.root}>

      <div className={classes.controlWrapper}>

        {/* Album Wrapper */}
        {/* <div className={classes.album}>
          <img src={currentSongData.thumbnail ? currentSongData.thumbnail.url : NoImage}
            alt="song_image"
            style={{ width:100, height: '100%', display:'block'}} />
        </div> */}

        {/* Controller Wrapper */}
        <div className={classes.playerControl}>

          {/* Player Controller */}
          {/* <div className={classes.test} style={{ flexDirection:'row', width:'80%', display:'flex', alignItems:'center'}}>
            <ShuffleIcon className={classNames(classes.icons,classes.itemFlex)}/>

            <SkipPrevIcon className={classNames(classes.icons,classes.itemFlex)} onClick={()=>changeTrack('prev') }/>
            {
              playState ?
              <PauseIcon className={classNames(classes.icons,classes.itemFlex, classes.bigIcon)} onClick={()=>controlFromPlayer("pause")}/>
              :
              <PlayIcon className={classNames(classes.icons,classes.itemFlex, classes.bigIcon)} onClick={()=>controlFromPlayer("play")}/>
            }
            <SkipNextIcon className={classNames(classes.icons,classes.itemFlex)} onClick={()=>changeTrack('next') }/>
            {
              (currentRepeatStatus.norepeat || currentRepeatStatus.all) &&
              <RepeatIcon className={classNames(classes.icons,classes.itemFlex, {[classes.repeatAll] : currentRepeatStatus.all})} onClick={playerRepeatStatus}/>
            }
            {
              currentRepeatStatus.single &&
              <RepeatOneIcon className={classNames(classes.icons,classes.itemFlex)} onClick={playerRepeatStatus}/>
            }
          </div> */}
          {/* <div> */}
            <BottomNavigation className={classes.bn_root}>
              <BottomNavigationAction className={classes.bn_action } label="Recents" value="recents" icon={<ShuffleIcon className={classNames(classes.icons)}/>} />
              <BottomNavigationAction className={classes.bn_action } label="Favorites" value="favorites" icon={<SkipPrevIcon className={classNames(classes.icons)} onClick={()=>changeTrack('prev') }/>} />
              <BottomNavigationAction className={classes.bn_action } label="Nearby" value="nearby"
                icon={
                      playState ?
                      <PauseIcon className={classNames(classes.icons)} onClick={()=>controlFromPlayer("pause")}/>
                      :
                      <PlayIcon className={classNames(classes.icons)} onClick={()=>controlFromPlayer("play")}/>
                     } />
              <BottomNavigationAction className={classes.bn_action } label="Folder" value="folder" icon={<SkipNextIcon className={classNames(classes.icons)} onClick={()=>changeTrack('next') }/>} />
              <BottomNavigationAction className={classes.bn_action } label="Folder" value="folder"
                icon={
                          ((currentRepeatStatus.norepeat || currentRepeatStatus.all) &&
                          <RepeatIcon className={classNames(classes.icons, {[classes.repeatAll] : currentRepeatStatus.all})} onClick={playerRepeatStatus}/>)

                           ||

                          (currentRepeatStatus.single &&
                          <RepeatOneIcon className={classNames(classes.icons, classes.repeatOne)} onClick={playerRepeatStatus}/>)

                     } />
            </BottomNavigation>
          {/* </div> */}


          <div style={{ height:10}}></div>

          {/* Song Duration */}
          <div className={classes.slider}>
            {/* {currentSongDuration} */}
            <Sliders
              total={currentSongDuration}
              currentPosition = {currentPosition}
              seekSong = { seekSong }
              sliderChangeStart = { sliderChangeStart }
              sliderChangeEnd = { sliderChangeEnd }
              sliderState = { sliderState }
              sliderValueWhileChanging = { sliderValueWhileChanging}
            />
          </div>

          {/* Song Title */}
          <div className={classes.test} style={{ width:'100%'}}>
            <Typography align="center" className={classes.title}>
              {currentSongTitle}
            </Typography>
          </div>

        </div>

      </div>

      <div id="controller_bottom">

      </div>
    </div>
  )
}

export default withStyles(styles)(PlayerController)
