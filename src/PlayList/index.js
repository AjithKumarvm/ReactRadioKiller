import React from 'react'
import { connect } from 'react-redux'
import { updatePlaylist } from '../actions'
import { playList } from '../dummy'
import './styles.scss'

class PlayList extends React.PureComponent {
  componentDidMount () {
    this.props.getPlayList()
    this.player = this.props.getPlayer()
  }
  checkIfPlaying = id => {
    const { playerStatus } = this.props
    return (
      this.props.currentStation.id === id &&
      (playerStatus === 'PLAYING' || playerStatus === 'BUFFERING')
    )
  }
  checkIfSelected = id => {
    return this.props.currentStation.id === id
  }
  componentDidUpdate (prevProps) {
    if (!prevProps.currentStation && this.props.playList.length) {
      this.player.play()({autoPlay: true})
    }
  }
  render () {
    if (this.props.playListLoader) {
      return <div className='playList hideScroll'>
        <div className='list placeholder selected active' />
        <div className='list placeholder selected' />
        <div className='list placeholder selected' />
        <div className='list placeholder selected' />
        <div className='list placeholder selected' />
        <div className='list placeholder selected' />
        <div className='list placeholder selected' />
      </div>
    }
    return (
      <div className='playList hideScroll'>
        {this.props.playList.map(station => {
          const classNames = ['list']
          this.checkIfSelected(station.id) && classNames.push('selected')
          this.checkIfPlaying(station.id) && classNames.push('active')
          return (
            <div className={classNames.join(' ')} key={station.id} onClick={this.player.play(station)}>
              {station.title} <div className='lang'>{station.genre.slice(0, 3)}</div>
            </div>
          )
        })}
      </div>
    )
  }
}

export default connect(
  ({ playList, playListLoader, currentStation, playerStatus }) => ({
    playList,
    playListLoader,
    currentStation,
    playerStatus
  }),
  dispatch => ({
    getPlayList: () => {
      // fetch('https://www.mocky.io/v2/5d8367f13400003322f4a489')
      fetch('https://firebasestorage.googleapis.com/v0/b/radio-streamer-6111f.appspot.com/o/playlist.json?alt=media')
        .then(resp => resp.json())
        .then(resp => {
          dispatch(updatePlaylist({ list: resp.music }))
        })
        .catch(e => {
          dispatch(updatePlaylist({ list: playList.music }))
          console.error('api failed', e)
        })
    }
  })
)(PlayList)
