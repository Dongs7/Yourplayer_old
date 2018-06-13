import React, { Component } from 'react'

import { connect } from 'react-redux'

import DisplayList  from 'components/DisplayList'

import { fetchSelectedSong, controlPlayFromIcon, fetchItemsFromPlaylist, addMusicToList, removeItemFromPlaylist } from 'actions'

class ResultList extends Component {
  constructor(props){
    super(props)

    this.state = {
      isMouseOver : '',
      isRemoveClicked : '',
      isModalOpen : false,
      isToasterOpen : false,
      titleToBeAdded : ''
    }
    this._handleSelectedSong = this._handleSelectedSong.bind(this)
    this._handleMouseOver = this._handleMouseOver.bind(this)
    this._handleMouseLeave = this._handleMouseLeave.bind(this)
    this._playerControl = this._playerControl.bind(this)
    this._handleList = this._handleList.bind(this)
    this._handleRemove = this._handleRemove.bind(this)
    this._handleModalClose = this._handleModalClose.bind(this)
    this._handleRemoveConfirmed = this._handleRemoveConfirmed.bind(this)
    this._closeToastWindow = this._closeToastWindow.bind(this)
  }

  // Send selected song ID when the user clicks the song from the result list
  _handleSelectedSong(id_val) {
    if(this.props.playingState){
      this._playerControl("pause")
    }
    this.props.fetchSelectedSong(id_val)
  }

  _handleMouseOver(e,id){
    if(id === e.currentTarget.id)
      this.setState({ isMouseOver : e.currentTarget.id })
  }

  _handleMouseLeave(e){
    this.setState({ isMouseOver : '' })
  }

  _playerControl(type){
    this.props.controlPlayFromIcon(type)
  }


  // Function to add the selected song to the playlist
  _handleList(videoId, videoTitle){
    this.setState({ isToasterOpen : true, titleToBeAdded : videoTitle })
    this.props.addMusicToList(videoId, this.props.userPlaylistId)
    setTimeout(()=>{
      this.setState({ isToasterOpen : false })
    }, 3000)
  }

  // Remove the selected song from the playlist
  _handleRemove(e){
    this.setState({ isRemoveClicked : e.currentTarget.id, isModalOpen : true})
  }


  // Confirmation Modal state controller
  _handleModalClose(){
    this.setState({ isRemoveClicked : '', isModalOpen : false})
  }


  // Remove the song after the user confirms
  _handleRemoveConfirmed(val){
    this.props.removeItemFromPlaylist(val, this.props.userPlaylistId)
    setTimeout(()=>{this._handleModalClose()}, 1000)


  }
  _closeToastWindow(){
    this.setState({ isToasterOpen : false })
  }

  render(){
    const { results, currentPlayingSong, playingState, forPlaylist, playlistResults } = this.props
    return(
      <DisplayList
        isPlaylist = { forPlaylist }
        data={forPlaylist ? playlistResults : results}
        selectedSong={this._handleSelectedSong}
        currentPlayingSong = { currentPlayingSong }
        mouseOverOnRow = { this._handleMouseOver }
        mouseLeaveOnRow = { this._handleMouseLeave }
        mouseState = { this.state.isMouseOver }
        playerControlFromDisplayList = { this._playerControl }
        playingState = { playingState }
        addItemToList={this._handleList}
        removeItem = { this._handleRemove }
        checkRemoveID = { this.state.isRemoveClicked }
        modalState = { this.state.isModalOpen }
        handleModalClose = { this._handleModalClose }
        removeItemFromList = { this._handleRemoveConfirmed }
        toasterState = { this.state.isToasterOpen }
        handleCloseToast = { this._closeToastWindow }
        titleTobeAdded = { this.state.titleToBeAdded }
      />
    )
  }
}

const mapStateToProps = state => {

  return{
    selectedSongId : state.fetchSong,
    results : state.dataFetch.results,
    playlistResults : state.dataFetch.playlistResults,
    currentPlayingSong : state.fetchSong,
    playingState : state.fetchPlayingState,
    user_info : state.userRed,
    userPlaylistId : state.playlistIdFetch
  }
}

ResultList.defaultProps = {
  forPlaylist : false
}

const mapDispatchToProps = { fetchSelectedSong, controlPlayFromIcon, addMusicToList, fetchItemsFromPlaylist, removeItemFromPlaylist }

export default connect(mapStateToProps, mapDispatchToProps)(ResultList)
