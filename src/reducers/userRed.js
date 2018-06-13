import { USER_LOGIN, USER_LOGOUT, USER_TOKEN } from 'actions/actionTypes'

const initialState = {
    user : null,
    token : null
}

const userRed = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN:
          return {...state,
              user : action.user
          }
        case USER_TOKEN:
          return{...state,
            token: action.token
          }

        case USER_LOGOUT :
          return {
            user: null,
            token:null
          }
        default:
            return state
    }
}

export default userRed
