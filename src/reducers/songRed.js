import { FETCH_SONG } from 'actions/actionTypes'

const initialState = {
  songID : '',
  songTitle : ''
}
export function fetchSong(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_SONG':
            return {
              songID : action.songdata.song_Id,
              songTitle : action.songdata.song_Title
            }

        default:
            return state;
    }
}
