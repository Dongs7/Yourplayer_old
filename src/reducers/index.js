import { combineReducers } from 'redux'

import userRed from './userRed'
import { dataError, dataFetch, dataLoading, playlistIdFetch } from './dataRed'
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
  playlistIdFetch,
  getPlayerRepeat
})

export default rootReducers
