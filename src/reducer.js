// Code Owner: Ajith VM

const defaultState = {
  playerStatus: 'INITIALISING',
  playListLoader: true,
  playList: [],
  currentStation: null,
  onlineStatus: navigator.onLine,
  userIntent: 'PLAY'
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

    default:
      return state
  }
}

export { reducer }
