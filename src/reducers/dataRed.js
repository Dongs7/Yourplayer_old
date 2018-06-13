import {FETCH_ERROR, FETCH_LOADING, FETCH_SUCCESS, RESET_DATA, FETCH_LIST_ID} from 'actions/actionTypes'

export function dataError(state = false, action) {
    switch (action.type) {
        case 'FETCH_ERROR':
            return action.fetchError;

        default:
            return state;
    }
}

export function dataLoading(state = false, action) {
    switch (action.type) {
        case 'FETCH_LOADING':
            return action.isLoading;

        default:
            return state;
    }
}

const initialStateForData = {
  results : [],
  playlistResults : []
}

export function dataFetch(state = initialStateForData, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            if(action.resultType === 1){
              return {
                ...state,
                results : action.data
              }
            }else{
              return {
                ...state,
                playlistResults : action.data
              }
            }

        case 'RESET_DATA' :
            console.log("reset")
            return {
              ...state,
              results : []
            }
        default:
            return state;
    }
}

export function playlistIdFetch(state = '', action){
  // console.log(action.playlistId)
  switch (action.type) {
      case 'FETCH_LIST_ID':
          return action.playlistId;

      default:
          return state;
  }
}
