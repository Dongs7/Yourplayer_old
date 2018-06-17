import * as actionTypes from './actionTypes'
import { API_KEY } from 'config'
// import store from './index';
import axios from 'axios'

export const getUserInfo = (user) =>{
  return{
    type: actionTypes.USER_LOGIN,
    user
  }
}

export const getUserToken = (token) =>{
  return{
    type: actionTypes.USER_TOKEN,
    token
  }
}

export const userLogout = () =>{
  return{
    type: actionTypes.USER_LOGOUT
  }
}


/**
 * @param {boolean} [bool = true, false] - true if loading, false otherwise
 */
export const dataLoading = (bool) =>{
  return{
    type: actionTypes.FETCH_LOADING,
    bool
  }
}

/**
 * @param {boolean} [bool = true, false] - true if error, false otherwise
 * @param {int} [msg : [4 - No channel found], [99 -  Error, but resolving in progress]] - type of error messages
 */
export const dataError = (bool, msg) =>{
  return{
    type: actionTypes.FETCH_ERROR,
    bool,
    msg
  }
}


/**
 * @param {object} data - data received from API
 * @param {int} [resultType : [1 - search result], [2 -  playlist result]] - type of results
 */
export const dataSuccess = (data, resultType) =>{
  return{
    type: actionTypes.FETCH_SUCCESS,
    data,
    resultType
  }
}

/**
 * @param {int} [resultType : [1 - reset search result], [2 - reset playlist result]] - type of resets
 */
export const dataReset = (target) =>{
  return{
    type: actionTypes.RESET_DATA,
    target
  }
}

export const fetchMoreBegin = () =>{
  return{
    type: actionTypes.FETCH_MORE_BEGIN
  }
}

/**
 * @param {object} data - data received from API
 * @param {int} [resultType : [1 - reset search result], [2 - reset playlist result]] - type of resets
 */
export const fetchMore = (data, resultType) =>{
  return{
    type: actionTypes.FETCH_MORE,
    data,
    resultType
  }
}

/**
 * @param {string} term - search term
 */
export const fetchTerm = (term) =>{
  return{
    type: actionTypes.FETCH_TERM,
    term
  }
}

/**
 * Search Youtube Video from given search term
 * @param {string} term - search term
 * @param {string} token - next pageToken if exists
 */
export const fetchData = (term,token) => (dispatch, getState) => {
  dispatch(fetchTerm(term))

  let pageToken  = ''

  if(term === ''){
    dispatch(dataReset(1))
  }else{
    if(token !== null){
      pageToken = `&pageToken=${token}`
    }

    const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&"
    let query = `q=${term}`
    const url_numQuery = "&maxResults="
    let maxNum = 10
    const topidId = "&topicId=/m/04rlf"
    const videoCategoryId = "&videoCategoryId=10"
    const url_postFix = "&type=video&key="

    let searchUrl = url + query + url_numQuery + maxNum + topidId + videoCategoryId + url_postFix + API_KEY

    if(token){
      searchUrl +=  pageToken
    }

    axios.get(searchUrl)
      .then((res) => {
        if(!res.status === 200){
          throw Error(res.statusText)
        }
        return res
      })
      .then((res) => {
        if(token){
          dispatch(fetchMore(res.data, 1))
        }else{
          dispatch(dataSuccess(res.data, 1))
        }

      })
      .catch(()=>dispatch(dataError(true)))
    }
}


/**
 * Get Video ID and Title on the selected song
 * @param {string} song_Id - Video ID
 * @param {string} song_Title - Video Title (trimmed)
 */
export const fetchSelectedSong = (song_Id, song_Title) => {
  return {
    type : actionTypes.FETCH_SONG,
    songdata:{
      song_Id,
      song_Title
    }
  }
}

/**
 * Get player's behavior when users click the button in the player
 * @param {string} [control_type : play, pause, done, repeatAll,.]
 */
export const controlPlayFromIcon = (control_type) => {
  return {
    type : actionTypes.CONTROL_FROM_ICON,
    control_type
  }
}

/**
 * Get player's current State
 * @param {boolean} [bool : true, false] - true when playing, false otherwise
 */
export const fetchPlayingState = (bool) => {
  return {
    type : actionTypes.FETCH_PLAYING_STATE,
    bool
  }
}

/**
 * Initialize player's playlist
 * @param {}
 */
export const initPlaylistForUser = () => (dispatch, getState) => {

  // Retrieve access token for api service from redux store
    const token = getState().userRed.token
    // console.log(token)
    let app_playlistId = ''
    const url = `https://www.googleapis.com/youtube/v3/playlists?access_token=${token}&part=snippet&mine=true`
    if(token){
      axios.get(url)
        .then((res)=>{

          // Check if the user has any playlists
          if(res.data.items.length > 0){
            // user already has playlists. find the playlist named YOURPLAYER_PLIST
            if(checkPlaylist(res.data.items) !== null){
              // Found the playlist
              app_playlistId = checkPlaylist(res.data.items)
              dispatch(fetchPlaylistID(app_playlistId))
            }else{
              // No playlist named YOURPLAYER_PLIST
              // Create one
              createPlayList().then((res)=>{
                app_playlistId = res
                dispatch(fetchPlaylistID(app_playlistId))
              }).catch((err)=>{
                console.log(err)
                dispatch(dataError(true))
              })
            }

          }else{
              createPlayList().then((res)=>{
                app_playlistId = res
                dispatch(fetchPlaylistID(app_playlistId))
              }).catch((err)=>{
                dispatch(dataError(true))
              })
          }
        })
        .catch((err)=>{
          // Error occurs when there's no youtube channel
          dispatch(dataLoading(false))
          dispatch(dataError(true,4))
        })

    }else{
      console.log("user not logged in or fail to retrieve token for api service")
    }
}



/**
 * Create Playlist, then return its ID
 * @param {}
 * @returns {Promise} Promise object represents user's playlist id
 */
const createPlayList = () => new Promise((resolve, reject)=> {
    console.log("create step 1")
    window.gapi.client.youtube.playlists.insert({
      part: 'snippet,status',
      resource: {
        snippet: {
          title: 'YOURPLAYER_PLIST',
          description: 'A private playlist created by YOURPLAYER APP'
        },
        status: {
          privacyStatus: 'private'
        }
      }
    }).then((res)=>{
      if(res){
        resolve(res)
      }else{
        reject(new Error(" Fetch result error "))
      }
    }).catch(err=>console.log(err))
  }).then((res)=>{

    return res.result.id
  }).catch((err)=>console.log(err))




  /**
   * Check if the user has the playlist named YOURPLAYER_PLIST
   * @param {array} listitem - array of user's playlists
   * @returns {string|null} user's playlist id or null if not exists
   */
const checkPlaylist = (listItem) => {
  let listId = ''
  listItem.filter((item,idx) => {
    if(item.snippet.title === 'YOURPLAYER_PLIST'){
      listId = item.id
    }
    return null
  })
  return listId
}


export const fetchPlaylistID = (playlistId) => {
  return{
    type: actionTypes.FETCH_LIST_ID,
    playlistId
  }
}

/**
 * Add the selected song to the user's playlist
 * @param {string} vId - Video ID
 * @param {string} pId - Target Playlist ID
 */
export const addMusicToList = (vId, pId) => (dispatch)=> {
  const detail = {
    videoId : vId,
    kind : 'youtube#video'
  }

  window.gapi.client.youtube.playlistItems.insert({
    part:'snippet',
    resource:{
      snippet:{
        playlistId : pId,
        resourceId : detail
      }
    }
  }).then(()=>{
    dispatch(fetchItemsFromPlaylist(pId))
  })

}

/**
 * Get items from the playlist
 * @param {string} pId - Target Playlist ID
 * @param {string} pageToken - next pageToken if exists
 */
export const fetchItemsFromPlaylist = (pId, pageToken) => dispatch => {
  dispatch(dataLoading(true))
  let requestOption = {
    playlistId : pId,
    part: 'snippet,id',
    maxResults : 6
  }

  // if pageToken parameter is provided, add this value to the 'requestOption' object
  if(pageToken !== null){
    requestOption.pageToken = pageToken
  }

  window.gapi.client.youtube.playlistItems.list(requestOption)
  .then((res)=>{

    if(res.result){
      if(pageToken){
        dispatch(fetchMore(res, 2))
      }else{
        dispatch(dataSuccess(res, 2))
      }
    }
    return res
  }).then((res)=>{
    // dispatch(dataError(false))
    dispatch(dataLoading(false))
  }).catch((err)=>{
    dispatch(dataLoading(false))
    dispatch(dataError(true))
  })
}

/**
 * Get current repeator state
 * @param {int} [selector : def = 1 [1 - norepeat, 2 - repeatOne, 3 - repeatAll]]
 */
export const playerRepeatSelector = (selector) => {
  return {
    type : 'SONG_REPEAT',
    selector
  }
}

/**
 * Remove the selected song from the playlist
 * @param {string} songID - selected song Id (not a video ID)
 * @param {string} pId - Target Playlist ID
 */
export const removeItemFromPlaylist = (songID, pId) => (dispatch) => {
  window.gapi.client.youtube.playlistItems.delete({
    id: songID
  }).then(()=>{
    dispatch(fetchItemsFromPlaylist(pId))
  })
}


/**
 * Create Youtube Channel if not exists
 * @param {int} [type : [ 1 - Open link , 2 - Find Channel ]]
 */
export const createChannel = (type) => (dispatch, getState) => {
  if(type === 1){
    // error still exists while the user is creating youtube channel, so we send errorCode 99
    dispatch(dataError(true,99))
    window.open("https://www.youtube.com/create_channel")
  }
  //the user clicks the reload button after creating the channel
  else{
    console.log('Finding Channel..')
    const token = getState().userRed.token
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id,snippet&mine=true&access_token=${token}`
    axios.get(url)
    .then((res)=>{
      console.log('Found Channel!')
      dispatch(dataError(false))
      dispatch(initPlaylistForUser())
    }).catch((err)=>{
      // Error can be occured if the user doesn't want to create a channel
      if(err.response.status === 404){
        dispatch(dataError(true,4))
      }
    })
  }
}
