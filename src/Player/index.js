import React from 'react'
import { connect } from 'react-redux'
import { updatePlayerStatus, updatePlayerTime, setStation } from '../actions'

let playerTimeStamp = 0
class Player extends React.PureComponent {
  attemptTimer = 0
  componentDidMount () {
    this.player = this.refs.player
  }
  onStatus = status => e => {
    if (status === 'PLAYING' && e && e.timeStamp) {
      playerTimeStamp = e.timeStamp
      this.attemptTimer = 0
      localStorage.setItem('currentStationId', this.props.currentStation.id)
    }
    this.props.onStatus(status)(e)
  }
  play = station => (params = { retry: false, autoPlay: false }) => {
    if (params.retry) {
      this.onStatus('WAITING')()
    } else {
      this.attemptTimer = 0
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
    player.ondurationchange = this.onStatus('DURATION')
    player.onstalled = this.onStatus('STALLED')
    player.onerror = this.onStatus('ERROR')
    player.ontimeupdate = this.props.onTimeUpdate
    try {
      player.play().catch(this.onError)
    } catch (e) {
      this.onError(e)
    }

    this.props.setStation({ station })
  }
  onError = e => {
    this.onStatus('ERROR')()
    this.attemptTimer = this.attemptTimer + 3000
    setTimeout(() => {
      this.props.playerStatus !== 'PLAYING' && this.play()({ retry: true })
    }, this.attemptTimer)
    console.error('EERR', e)
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
  ({ playerStatus, playerTime, currentStation, playList }) => ({
    playerStatus,
    playerTime,
    currentStation,
    playList
  }),
  dispatch => ({
    setStation: station => {
      dispatch(setStation(station))
    },
    onStatus: status => e => {
      dispatch(updatePlayerStatus({ status }))
    },
    onTimeUpdate: ({ timeStamp }) => {
      dispatch(updatePlayerTime({ timeStamp: timeStamp - playerTimeStamp }))
    }
  }),
  null,
  { forwardRef: true }
)(Player)
