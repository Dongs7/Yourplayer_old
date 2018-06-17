import React, { Component } from 'react'

import { connect } from 'react-redux'
import find from 'lodash/find'

import DisplayList  from 'components/DisplayList'

import { fetchSelectedSong, controlPlayFromIcon, fetchItemsFromPlaylist, addMusicToList, removeItemFromPlaylist, fetchData } from 'actions'

class ResultList extends Component {
  constructor(props){
    super(props)

    this.state = {
      isMouseOver : '',
      isRemoveClicked : '',
      isModalOpen : false,
      isToasterOpen : false,
      toastContents : {
        text : '',
        error : false
      }
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
    this._loadMorePlaylist = this._loadMorePlaylist.bind(this)
  }

  // Send selected song ID when the user clicks the song from the result list
  _handleSelectedSong(id_val, title_val) {
    if(this.props.playingState){
      this._playerControl("pause")
    }
    this.props.fetchSelectedSong(id_val, title_val)

  }

  _handleMouseOver(e,id){
    if(id === e.currentTarget.id)
      this.setState({ isMouseOver : e.currentTarget.id })
  }

  _handleMouseLeave(e){
    this.setState({ isMouseOver : '' })
  }

  _playerControl(type, vId, title){
    // if videoId and title params are provided, execute action function
    if(vId !== undefined && title !== undefined){
      this.props.fetchSelectedSong(vId, title)
    }
    this.props.controlPlayFromIcon(type)
  }


  // Function to add the selected song to the playlist if the song is not in the playlist
  _handleList(videoId, videoTitle){
    // console.log("this firssss")
    console.log(this.props.playlistResults)
    if(this.props.playlistResults.length <= 0) {
      this.setState({ isToasterOpen : true, toastContents : {text :'We can\'t access your playlist. Please create or reinitialize the playlist', error: true} })
    }else {
      let dupfind = false
      find(this.props.playlistResults.items, (item) => {
        // console.log(item)
        if(item.snippet.resourceId.videoId === videoId){
            dupfind = true
            return
        }
      })

      if(dupfind){
        this.setState({ isToasterOpen : true, toastContents : {text :`${videoTitle} is already in your playlist`, error: true} })
      }else{
        this.setState({ isToasterOpen : true, toastContents : {text :`${videoTitle} is successfully added to your playlist`, error: false} })
        this.props.addMusicToList(videoId, this.props.userPlaylistId)
      }
    }
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

  _loadMorePlaylist(target){
    const { userPlaylistId, playlistPageToken, resultPageToken, currentSearchTerm } = this.props
    if(target === 'playlist'){
      this.props.fetchItemsFromPlaylist(userPlaylistId, playlistPageToken)
    }else{
      this.props.fetchData(currentSearchTerm, resultPageToken)
    }
  }

  render(){
    const { results,
            playlistTotalItems,
            currentPlayingSong,
            playingState,
            forPlaylist,
            playlistResults,
            resultPageToken,
            playlistPageToken,
            userPlaylistId,
            isLoading,
            isError
          } = this.props
    return(
      <DisplayList
        isPlaylist = { forPlaylist }
        data={forPlaylist ? playlistResults : results}
        pageToken = { forPlaylist ? playlistPageToken : resultPageToken }
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
        toastContents = { this.state.toastContents }
        loadPlaylist = { this._loadMorePlaylist }
        totalNumberofItemsInList = { playlistTotalItems }
        isLoading = { isLoading }
        isError = { isError }
      />
    )
  }
}


ResultList.defaultProps = {
  forPlaylist : false,
  resultPageToken : null,
  playlistPageToken : null
}

const mapStateToProps = state => {
  return{
    results : state.dataFetch.results,
    resultPageToken : state.dataFetch.results.nextPageToken,
    playlistResults : state.dataFetch.playlistResults,
    playlistPageToken : state.dataFetch.playlistResults.nextPageToken,
    playlistTotalItems : state.dataFetch.playlistResults.totalItems,
    currentPlayingSong : state.fetchSong.songID,
    playingState : state.fetchPlayingState,
    user_info : state.userRed,
    userPlaylistId : state.pID,
    currentSearchTerm : state.termFetch,
    isLoading : state.dataLoading,
    isError : state.dataError
  }
}



const mapDispatchToProps = { fetchSelectedSong, controlPlayFromIcon, addMusicToList, fetchItemsFromPlaylist, removeItemFromPlaylist, fetchData }

export default connect(mapStateToProps, mapDispatchToProps)(ResultList)
