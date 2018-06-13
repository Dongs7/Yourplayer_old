import React, { Component } from 'react'

import { connect } from 'react-redux'
import find from 'lodash/find'
import { fetchPlayingState, controlPlayFromIcon, playerRepeatSelector, fetchSelectedSong } from 'actions'
import PlayerController from 'components/PlayerController'

import YouTube from 'react-youtube'


// Player Container
class Player extends Component {
  constructor(props){
    super(props)
    this.state = {
      player:{},
      // isPlaying : false,
      songDuration : 0,
      songTitle : '',
      currentPosition : 0,
      repeatCounter : 1,
      currentSongIdx : 0,
      // toastOpen : false
    }

    this._handleReady = this._handleReady.bind(this)
    this._onPlay = this._onPlay.bind(this)
    this._onPause = this._onPause.bind(this)
    this._onEnd = this._onEnd.bind(this)
    this._onStateChange = this._onStateChange.bind(this)
    this._handleControlFromPlayer = this._handleControlFromPlayer.bind(this)
    this._handleControl = this._handleControl.bind(this)
    this._handleRepeat = this._handleRepeat.bind(this)
    this._getNextSongVideoId = this._getNextSongVideoId.bind(this)
    this._getPrevSongVideoId = this._getPrevSongVideoId.bind(this)
    this._handleTrack = this._handleTrack.bind(this)

  }

  // Control Youtube player

  _handleControl(value){
    // console.log("CHECK CONTROL VALUE :  " , value)
    if(value === 'pause' || value === 'done'){
      this.props.fetchPlayingState(false)
      this._onPause()
    }else{
      this.props.fetchPlayingState(true)
      this._onPlay()
    }

  }


  _handleReady(e){
    this.setState({ player : e.target })
  }

  // Function to get current song position
  currentTimer(value){
    this.setState({ currentPosition : value })
  }

  // Receive actions from the custom player, then control youtube player.
  _handleControlFromPlayer(type){
    // console.log("control btn clicked from playcontroller ", type)
    this.props.controlPlayFromIcon(type)
  }

  // Get Current song index from the playlist
  _getCurrentSongIndexFromPlaylist(currentSongId, playlistItems){
    let idx = 0
    find(playlistItems, (value, index) => {
      if(value.snippet.resourceId.videoId === currentSongId){
        idx = index
      }
    })
    console.log(idx)
    return idx
  }

  _onPlay(){
    // console.log("Youtube Video Starts")
    // Get index of the song currently playing. If the song is not in the playlist, then it will return 0
    let curSongIdx = this._getCurrentSongIndexFromPlaylist(this.props.selectedSongId, this.props.playlistResults)
    this.setState({ currentSongIdx : curSongIdx})

    // Get the current song's total duration
    this.setState({ songDuration : this.state.player.getDuration() })

    // Get the Song's title
    this.setState({ songTitle : this.state.player.getVideoData().title })

    // Send the song's current time in every 100ms
    this.timer = setInterval(()=>
                  {this.currentTimer(this.state.player.getCurrentTime())}
                  ,100)

    // Play the video
    this.state.player.playVideo()
  }

  _onPause(){
    console.log("Pause Player")
    clearInterval(this.timer)
    this.state.player.pauseVideo()
  }


  _onEnd(){
    console.log("Playback Ends ")
    this.setState({ currentPosition : 0 })
    this.setState({ songDuration : 0 })

    // If repeat button is activated,
    if(this.props.repeatSelector.single){
      this._onPlay()
    }else if(this.props.repeatSelector.all){
      let videoId = this._getNextSongVideoId()
      this.props.fetchSelectedSong(videoId)
    }else{
      this.props.controlPlayFromIcon("done")
    }
  }

  // Handle custom Player using Youtube iframe state data
  _onStateChange(e) {
    clearInterval(this.timer)
    // console.log(e.data + ' State Value ')

    // 5 - Video Cued
    if(e.data === 5){

      // Intentionally send pause first in order to manage custom player state accurate.
      this.props.controlPlayFromIcon("pause")
      if(this.props.repeatSelector.all){
        this.props.controlPlayFromIcon("repeatAll")
      }else{
        this.props.controlPlayFromIcon("play")
      }

      // -1 - No data
      // 3 - Buffering
    }else if(e.data === -1 || e.data === 3){
      this.setState({ songTitle : 'Getting next song..'})
    }
  }


  // Get Next Song's ID from the playlist
  _getNextSongVideoId(){
    let videoId = ''
    if(this.state.currentSongIdx + 1 < this.props.playlistResults.length){
      videoId = this.props.playlistResults[this.state.currentSongIdx + 1].snippet.resourceId.videoId
      this.setState({ currentSongIdx : this.state.currentSongIdx + 1 })
    }else{
      videoId = this.props.playlistResults[0].snippet.resourceId.videoId
      this.setState({ currentSongIdx : 0})
    }
    return videoId
  }

  // Get Prev Song's ID from the playlist
  _getPrevSongVideoId(){
    let videoId = ''
    if(this.state.currentSongIdx - 1 >= 0){
      videoId = this.props.playlistResults[this.state.currentSongIdx - 1].snippet.resourceId.videoId
      this.setState({ currentSongIdx : this.state.currentSongIdx - 1 })
    }else{
      videoId = this.props.playlistResults[this.props.playlistResults.length - 1].snippet.resourceId.videoId
      this.setState({ currentSongIdx : this.props.playlistResults.length - 1})
    }
    return videoId
  }

  // Toggle 3 icon buttons using state.
  _handleRepeat(){
    let counter = this.state.repeatCounter
    counter = counter !== 3 ? counter + 1 : 1
    this.setState({ repeatCounter: counter})
    this.props.playerRepeatSelector(counter)
  }



  componentDidUpdate(prevProps){

    // Compare the previous and the current value of controlFromIcon
    // Execute handleControl function only if they are not matched.
    if(prevProps.controlFromIcon !== this.props.controlFromIcon){
      this._handleControl(this.props.controlFromIcon)
    }
  }



  // Function to control Skip buttons from the Custom Player
  _handleTrack(direction){
    this.props.controlPlayFromIcon("pause")

    if(this.props.playlistResults){
      if( this.props.playlistResults.length > 0) {
        let videoId = ''
        if(direction === 'prev'){
          videoId = this._getPrevSongVideoId()
        }else{
          videoId = this._getNextSongVideoId()
        }
        this.props.fetchSelectedSong(videoId)
      }else{
        console.log("no playlist available")
      }
    }else{
      console.log("no playlist initialized")
    }
  }

  render(){

    const {  selectedSongId, playingState, repeatSelector } = this.props
    const {  songDuration, songTitle, currentPosition } = this.state
    let opts = {
      width:0,
      height:0,
      playerVars: {
        autoplay: 0,
        fs:1,
        playsinline:1
      },
    }

    return(
      <div>

        <PlayerController
          playState = {playingState}
          controlFromPlayer = {this._handleControlFromPlayer}
          currentSongTitle={ songTitle }
          currentSongDuration = {songDuration}
          currentPosition = { currentPosition }
          playerRepeatStatus = { this._handleRepeat }
          currentRepeatStatus = { repeatSelector }
          changeTrack = { this._handleTrack }
        />
        <YouTube
          videoId={selectedSongId}
          opts={opts}
          onPlay={this._onPlay}
          onPause={this._onPause}
          onEnd={this._onEnd}
          onStateChange={this._onStateChange}
          onReady={this._handleReady}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return{
    selectedSongId : state.fetchSong,
    controlFromIcon : state.controlPlayer,
    playingState : state.fetchPlayingState,
    repeatSelector : state.getPlayerRepeat,
    playlistResults : state.dataFetch.playlistResults.items
  }
}

const mapDispatchToProps = { fetchPlayingState, controlPlayFromIcon, playerRepeatSelector, fetchSelectedSong }

export default connect(mapStateToProps, mapDispatchToProps)(Player)
