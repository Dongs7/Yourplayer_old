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
  console.log("token fires")
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

export const dataLoading = (bool) =>{
  return{
    type: actionTypes.FETCH_LOADING,
    isLoading : bool
  }
}

export const dataError = (bool) =>{
  return{
    type: actionTypes.FETCH_ERROR,
    fetchError : bool
  }
}

export const dataSuccess = (data, resultType) =>{
  return{
    type: actionTypes.FETCH_SUCCESS,
    data,
    resultType
  }
}

export const dataReset = () =>{
  return{
    type: actionTypes.RESET_DATA
  }
}

export function errorAfterFiveSeconds() {
  return(dispatch)=>{
    setTimeout(()=>{
      dispatch(dataError(true))
    }, 5000)
  }
}

export const fetchData = (term) => dispatch => {
    console.log("fetchdata init")
    if(term === ''){
      dispatch(dataReset())
    }
    else{


    dispatch(dataLoading(true))

    const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q="
    var query = term
    const url_numQuery = "&maxResults="
    var maxNum = 45
    const topidId = "&topicId=/m/04rlf"
    const videoCategoryId = "&videoCategoryId=10"
    const url_postFix = "&type=video&key="
    // const pageToken = "&pageToken="

    var searchUrl = url + query + url_numQuery + maxNum + topidId + videoCategoryId + url_postFix + API_KEY
    console.log("befire axios")
    axios.get(searchUrl)
      .then((res) => {
        if(!res.status === 200){
          throw Error(res.statusText)
        }
        console.log(res)
        dispatch(dataLoading(false))
        return res
      })
      .then((res) => {
        console.log("dataSuccess call")
        dispatch(dataSuccess(res.data, 1))
      })
      .catch(()=>dispatch(dataError(true)))
    }
}

// SELECTED Song

export const fetchSelectedSong = (song_Id, song_Title) => {
  return {
    type : actionTypes.FETCH_SONG,
    songdata:{
      song_Id,
      song_Title
    }
  }
}

export const controlPlayFromIcon = (control_type) => {
  return {
    type : actionTypes.CONTROL_FROM_ICON,
    control_type
  }
}

export const fetchPlayingState = (bool) => {
  return {
    type : actionTypes.FETCH_PLAYING_STATE,
    bool
  }
}

// Actions related to playlist

export const initPlaylistForUser = () => (dispatch, getState) => {
  // Retrieve access token for api service from redux store
    const token = getState().userRed.token
    let app_playlistId = ''
    const url = `https://www.googleapis.com/youtube/v3/playlists?access_token=${token}&part=snippet&mine=true`
    if(token){
      axios.get(url)
        .then((res)=>{

          // console.log("check if user has YOURPLAYER_PLIST playlist,");
          // console.log("step 1")
          if(res.data.items.length > 0){
            // console.log("step 2 if length is > 0")
            if(checkPlaylist(res.data.items) !== ''){
              // console.log("list found")
              app_playlistId = checkPlaylist(res.data.items)
              dispatch(fetchPlaylistID(app_playlistId))
            }else{
              // console.log("list not found")
              createPlayList().then((res)=>{
                app_playlistId = res
                dispatch(fetchPlaylistID(app_playlistId))
              })
                // console.log("step 3 and after create ", app_playlistId)
            }

          }else{
              // console.log("dne and length s 0, create list first")
              createPlayList().then((res)=>{
                app_playlistId = res
                dispatch(fetchPlaylistID(app_playlistId))
              })
          }
          // console.log(app_playlistId)
        })
        .catch((err)=>console.log(err))

    }else{
      console.log("user not logged in or fail to retrieve token for api service")
    }
}



// Promise function to create a new playlist for the app, then fetch its ID value
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




// Function to check if the user has playlist named 'YOURPLAYER_PLIST' and return its id if exists.
const checkPlaylist = (listItem) => {
  let listId = ''
  listItem.filter((item,idx) => {
    if(item.snippet.title === 'YOURPLAYER_PLIST'){
      listId = item.id
    }
    return null
  })
  // console.log(listId, ' from action check playlist')
  return listId
}

export const fetchPlaylistID = (playlistId) => {
  return{
    type: actionTypes.FETCH_LIST_ID,
    playlistId
  }
}

// Function to add the selected music to the playlist
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

// Fetch Items in the Playlist
export const fetchItemsFromPlaylist = (pId, pageToken) => (dispatch) => {
  let requestOption = {
    playlistId : pId,
    part: 'snippet,id',
    maxResults : 15
  }

  // if pageToken parameter is provided, add this value to the 'requestOption' object
  if(pageToken){
    requestOption.pageToken = pageToken
  }

  const request = window.gapi.client.youtube.playlistItems.list(requestOption)
  request.execute((res)=>{
    if(res.result){
      dispatch(dataSuccess(res, 2))
    }
  })
}

export const playerRepeatSelector = (selector) => {
  return {
    type : 'SONG_REPEAT',
    selector
  }
}

export const removeItemFromPlaylist = (songID, pId) => (dispatch) => {
  window.gapi.client.youtube.playlistItems.delete({
    id: songID
  }).then(()=>{
    dispatch(fetchItemsFromPlaylist(pId))
  })
}
