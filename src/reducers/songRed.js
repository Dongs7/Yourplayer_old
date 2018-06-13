import { FETCH_SONG } from 'actions/actionTypes'

export function fetchSong(state = '', action) {
    switch (action.type) {
        case 'FETCH_SONG':
            return action.song_Id;

        default:
            return state;
    }
}
