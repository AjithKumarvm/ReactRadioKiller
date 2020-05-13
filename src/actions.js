export const updatePlaylist = ({ list }) => ({
  type: 'UPDATE_PLAYLIST',
  list: list.map((list, index) => ({ ...list, index }))
})

export const updatePlayerStatus = ({ status }) => ({
  type: 'UPDATE_PLAYER_STATUS',
  status
})

export const updatePlayerTime = ({ timeStamp }) => ({
  type: 'UPDATE_PLAYER_TIME',
  timeStamp
})

export const setStation = ({ station }) => ({
  type: 'SET_STATION',
  station
})

export const updateOnlineStatus = ({ status }) => ({
  type: 'UPDATE_ONLINE_STATUS',
  status
})

export const updateUserIntent = ({ intent }) => ({
  type: 'UPDATE_USER_INTENT',
  intent
})

export const updateLoginStatus = (loginStatus) => ({
  type: 'UPDATE_GDRIVE_LOGIN_STATUS',
  loginStatus
})

export const updateFiles = ({files, nextPageToken}) => ({
    type: 'UPDATE_FILES',
    files,
    nextPageToken
})
