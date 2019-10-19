import React from 'react'
import { connect } from 'react-redux'
import { updatePlayerStatus, updatePlayerTime, setStation, updateOnlineStatus } from '../actions'

let playerTimeStamp = 0
class Player extends React.PureComponent {
  componentDidMount () {
    this.player = this.refs.player
    window.addEventListener('online',  this.updateIndicator)
    window.addEventListener('offline', this.props.updateIndicator)
  }
  componentWillUnmount () {
    window.removeEventListener('online',  this.props.updateIndicator)
    window.removeEventListener('offline', this.props.updateIndicator)
  }
  updateIndicator = () => {
    if (this.props.playerStatus !== 'PLAYING' && this.props.userIntent === 'PLAY' && window.navigator.onLine) {
      this.play()({ retry: true })
    }
    this.props.updateIndicator()
  }
  onStatus = status => e => {
    if (status === 'PLAYING' && e && e.timeStamp) {
      playerTimeStamp = e.timeStamp
      localStorage.setItem('currentStationId', this.props.currentStation.id)
    }
    this.props.onStatus(status)(e)
  }
  play = station => (params = { retry: false, autoPlay: false }) => {
    if (params.retry) {
      this.onStatus('WAITING')()
    }
    this.onStatus('PAUSE')()
    const { player } = this.refs
    if (params.autoPlay && localStorage.getItem('currentStationId')) {
      const currentStationId = localStorage.getItem('currentStationId')
      const filtered = this.props.playList.filter(({ id }) => id === currentStationId)
      if (filtered.length) {
        station = filtered[0]
      }
    }
    station = station || this.props.currentStation
    player.src = station.source
    player.onloadedmetadata = this.onMeta
    player.onaudioprocess = this.audioProcess
    player.onplay = this.onStatus('PLAY')
    player.onplaying = this.onStatus('PLAYING')
    player.onpause = this.onStatus('PAUSE')
    player.onwaiting = this.onStatus('WAITING')
    player.onstalled = this.onStatus('STALLED')
    player.onerror = this.onStatus('ERROR')
    player.ontimeupdate = this.props.onTimeUpdate
    try {
      player.play().catch(this.onError)
    } catch (e) {
      console.error('player', e)
      this.onError(e)
    }

    this.props.setStation({ station })
  }
  onError = e => {
    this.onStatus('ERROR')()
  }
  pause = () => {
    const { player } = this.refs
    player.pause()
  }
  render () {
    return <audio ref='player' />
  }
}

export default connect(
  ({ playerStatus, playerTime, currentStation, playList, userIntent }) => ({
    playerStatus,
    playerTime,
    currentStation,
    playList,
    userIntent
  }),
  dispatch => ({
    setStation: station => {
      dispatch(setStation(station))
    },
    onStatus: status => e => {
      console.log('onStatus', status, e)
      dispatch(updatePlayerStatus({ status }))
    },
    onTimeUpdate: ({ timeStamp }) => {
      dispatch(updatePlayerTime({ timeStamp: timeStamp - playerTimeStamp }))
    },
    updateIndicator: () => {
      dispatch(updateOnlineStatus({status: navigator.onLine}))
    }
  }),
  null,
  { forwardRef: true }
)(Player)
