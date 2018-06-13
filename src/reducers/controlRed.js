import { CONTROL_FROM_ICON, FETCH_PLAYING_STATE, SONG_REPEAT } from 'actions/actionTypes'

export function controlPlayer(state = '', action) {
    switch (action.type) {
        case 'CONTROL_FROM_ICON':
            return action.control_type;

        default:
            return state;
    }
}

export function fetchPlayingState(state = false, action) {
    switch (action.type) {
        case 'FETCH_PLAYING_STATE':
            return action.bool;

        default:
            return state;
    }
}

const initRepeatState = {
  norepeat: true,
  single : false,
  all : false
}
export function getPlayerRepeat(state = initRepeatState, action ) {

  switch (action.type) {
    case 'SONG_REPEAT' :
      if(action.selector === 1){
        return {
          norepeat:true,
          all:false,
          single : false
        }
      }
      else if(action.selector === 2){
        return {
          norepeat:false,
          all:false,
          single : true
        }
      }
      else{
        return{
          norepeat:false,
          all:true,
          single : false
        }
      }

      default :
        return state
  }
}
