// Code Owner: Ajith VM

const defaultState = {
  playerStatus: 'INITIALISING',
  playListLoader: true,
  playList: [],
  currentStation: null,
  onlineStatus: navigator.onLine,
  userIntent: 'PLAY',
  gDrive: {
    loginStatus: 'loading',
    files: []
  }
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'UPDATE_PLAYER_STATUS': {
      return {
        ...state,
        playerStatus: action.status
      }
    }

    case 'UPDATE_PLAYLIST': {
      return {
        ...state,
        playList: action.list,
        playListLoader: false,
        currentStation: action.list[0]
      }
    }

    case 'UPDATE_PLAYER_TIME': {
      return {
        ...state,
        playerTime: action.timeStamp
      }
    }

    case 'SET_STATION': {
      return {
        ...state,
        currentStation: action.station
      }
    }

    case 'UPDATE_ONLINE_STATUS': {
      return {
        ...state,
        onlineStatus: action.status
      }
    }

    case 'UPDATE_USER_INTENT': {
      return {
        ...state,
        userIntent: action.intent
      }
    }

    case 'UPDATE_GDRIVE_LOGIN_STATUS': {
      return {
        ...state,
        gDrive: {
          ...state.gDrive,
          loginStatus: action.loginStatus
        }
      }
    }

    case 'UPDATE_FILES': {
      return {
        ...state,
        gDrive: {
          ...state.gDrive,
          files: [...state.gDrive.files, ...action.files],
          nextPageToken: action.nextPageToken
        }
      }
    }

    default:
      return state
  }
}

export { reducer }
