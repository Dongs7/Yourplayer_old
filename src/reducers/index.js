import { combineReducers } from 'redux'

import userRed from './userRed'
import { dataError, dataFetch, dataLoading, playlistIdFetch, termFetch } from './dataRed'
import { fetchSong } from './songRed'
import { controlPlayer, fetchPlayingState, getPlayerRepeat } from './controlRed'

const rootReducers = combineReducers({
  userRed,
  dataError,
  dataFetch,
  dataLoading,
  fetchSong,
  controlPlayer,
  fetchPlayingState,
  pID: playlistIdFetch,
  getPlayerRepeat,
  termFetch
})

export default rootReducers
