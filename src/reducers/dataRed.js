import {FETCH_ERROR, FETCH_LOADING, FETCH_SUCCESS, RESET_DATA, FETCH_LIST_ID, FETCH_TERM, FETCH_MORE} from 'actions/actionTypes'

const initialStateForError = {
  isError : false,
  errMsg : null
}

export function dataError(state = initialStateForError, action) {
    switch (action.type) {
        case 'FETCH_ERROR':
            if(action.bool){
              return {
                isError : true,
                errMsg : action.msg
              }
            }else{
              return {
                isError : false,
                errMsg : null
              }
            }

        default:
            return state;
    }
}

export function dataLoading(state = false, action) {
    // console.log("dataLoading in! : ", action)
    switch (action.type) {
        case 'FETCH_LOADING':
            return action.bool;

        default:
            return state;
    }
}

export function termFetch(state = '', action) {
  switch(action.type) {
    case 'FETCH_TERM':
      return action.term
    default:
      return state
  }
}


const initialStateForData = {
  results : {
    items : [],
    nextPageToken : null
  },
  playlistResults : {
    items : [],
    nextPageToken : null,
    totalItems : 0
  }
}
export function dataFetch(state = initialStateForData, action) {
    switch (action.type) {
        case 'FETCH_SUCCESS':
            if(action.resultType === 1){
              return {
                ...state,
                results : {
                  nextPageToken : action.data.nextPageToken,
                  items : action.data.items
                }
              }
            }else{
              console.log(action)
              return {
                ...state,
                playlistResults:{
                  nextPageToken : action.data.nextPageToken,
                  items : action.data.result.items,
                  totalItems : action.data.result.pageInfo.totalResults
                }
              }
            }

        case 'FETCH_MORE' :
            if(action.resultType === 1){
              return {
                ...state,
                results : {
                  nextPageToken : action.data.nextPageToken,
                  items : state.results.items.concat(action.data.items)
                }
              }
            }else{
              return {
                ...state,
                playlistResults:{
                  ...state.playlistResults,
                  nextPageToken : action.data.nextPageToken,
                  items : state.playlistResults.items.concat(action.data.result.items)
                }
                // playlistResults.items : action.data.result.items
              }
            }

        case 'RESET_DATA' :
            console.log("reset")
            if(action.target === 1){
              return {
                ...state,
                results : {
                  items : [],
                  nextPageToken : null
                }
              }
            }else{
              return {
                ...state,
                playlistResults : {
                  items : [],
                  nextPageToken : null,
                  totalItems: 0
                }
              }
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
