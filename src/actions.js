export const updatePlaylist = ({ list }) => ({
  type: 'UPDATE_PLAYLIST',
  list: list.map((list, index) => ({...list, index}))
})

export const updatePlayerStatus = ({status}) => ({
    type: 'UPDATE_PLAYER_STATUS',
    status
})

export const updatePlayerTime = ({timeStamp}) => ({
    type: 'UPDATE_PLAYER_TIME',
    timeStamp
})

export const setStation = ({station}) => ({
    type: 'SET_STATION',
    station
})
