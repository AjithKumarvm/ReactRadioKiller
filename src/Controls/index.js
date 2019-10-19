import React from 'react'
import { connect } from 'react-redux'
import './styles.scss'
import './prev_next.scss'
import PlayerMeta from './PlayerMeta'
import PlayerTimer from './PlayerTimer'
import {updateUserIntent} from './../actions'

class Controls extends React.PureComponent {
  componentDidMount () {
    this.player = this.props.getPlayer()
  }
  action = () => {
    if (this.props.playerStatus === 'PLAYING' || this.props.playerStatus === 'WAITING') {
      this.player.pause()
      this.props.updateUserIntent('PAUSE')
    } else {
      this.player.play()()
      this.props.updateUserIntent('PLAY')
    }
  }
  playerIcon = () => {
    if (this.props.playerStatus === 'PLAYING') {
      return <div className='playStopControls stop' />
    } else if (this.props.playerStatus === 'PAUSE') {
      return <div className='playStopControls play' />
    } else if (this.props.playerStatus === 'STALLED' || this.props.playerStatus === 'ERROR') {
      return <div className='playStopControls stalled' />
    } else {
      return <div className='playStopControls buffer' />
    }
  }
  changeTrack = action => () => {
    let station = this.props.playList[0]
    if (action === 'NEXT') {
      if (this.props.currentStationIndex === this.props.playList.length - 1) {
        station = this.props.playList[0]
      } else {
        station = this.props.playList[this.props.currentStationIndex + 1]
      }
    } else {
      if (this.props.currentStationIndex === 0) {
        station = this.props.playList[this.props.playList.length - 1]
      } else {
        station = this.props.playList[this.props.currentStationIndex - 1]
      }
    }
    this.props.updateUserIntent('PLAY')
    this.player.play(station)()
  }

  prevNextIcon = () => (
    <React.Fragment>
      <div className='triangle' />
      <div className='bar' />
    </React.Fragment>
  )
  prev = () => {
    if (this.props.playerStatus === 'INITIALISING') {
      return null
    }
    return (
      <div
        className='actions prev prevNextControl'
        onClick={this.changeTrack('PREV')}
      >
        <this.prevNextIcon />
      </div>
    )
  }
  next = () => {
    if (this.props.playerStatus === 'INITIALISING') {
      return null
    }
    return (
      <div
        className='actions next prevNextControl'
        onClick={this.changeTrack('NEXT')}
      >
        <this.prevNextIcon />
      </div>
    )
  }
  render () {
    const inner = ['innerWrapper']
    !this.props.playListLoader && inner.push('anim')
    const outer = ['playerControls']
    !this.props.playListLoader && outer.push('controlAnim')
    return (
      <div className={outer.join(' ')}>
        <div className={inner.join(' ')}>
          {!this.props.playListLoader && (
            <PlayerMeta currentStation={this.props.currentStation} />
          )}
          {!this.props.playListLoader && <this.prev />}
          <div className='actions' onClick={this.action}>
            <this.playerIcon />
          </div>
          {!this.props.playListLoader && <this.next />}
          <PlayerTimer playerTime={this.props.playerTime} playerStatus={this.props.playerStatus} />
        </div>
      </div>
    )
  }
}

export default connect(
  ({ playerStatus, playList, currentStation, playListLoader, playerTime, onlineStatus, userIntent }) => ({
    playerStatus,
    playList,
    currentStationIndex: currentStation ? currentStation.index : 0,
    currentStation,
    playListLoader,
    playerTime,
    onlineStatus,
    userIntent
  }),
  dispatch => ({
    updateUserIntent: intent => dispatch(updateUserIntent({intent}))
  })
)(Controls)
