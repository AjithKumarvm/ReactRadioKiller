import React from 'react'
import { connect } from 'react-redux'
import { CSSTransition } from 'react-transition-group'

import './App.scss'
import PlayList from './PlayList'
import Player from './Player'
import Controls from './Controls'
import GDrive from './GDrive'
class App extends React.PureComponent {
  state = {
    show: false
  }
  componentDidMount () {
    this.setState({
      show: true
    })
  }
  player = React.createRef()
  play = station => {
    this.player.current.play(station)()
  }
  getPlayer = () => this.player.current
  offlineMessage = () =>
    !this.props.onlineStatus ? (
      <div className='offlineMessage'>
        YOU ARE OFFLINE, MUSIC WILL RESUME WHEN YOU ARE ONLINE
      </div>
    ) : null
  render () {
    return (
      <>
        <div className={!this.props.onlineStatus ? 'offline' : ''}>
          <h1 className='colored'>RADIO KILLER</h1>
          <CSSTransition in={this.state.show} timeout={300} classNames='rkAnim'>
            <div className='rkContainer'>
              <Player ref={this.player} />
              <GDrive play={this.play} getPlayer={this.getPlayer} />
              {/* <PlayList play={this.play} getPlayer={this.getPlayer} /> */}
              <Controls getPlayer={this.getPlayer} />
            </div>
          </CSSTransition>
        </div>
        <div className='playLink'>
          <a target='_blank' href='https://play.google.com/store/apps/details?id=com.vilvan.android.radiokiller&utm_source=radiokillerpage&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
            <img
              alt='Get it on Google Play'
              height='60'
              src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png'
            />
          </a>
        </div>
        <this.offlineMessage />
      </>
    )
  }
}

export default connect(({ onlineStatus }) => ({
  onlineStatus
}))(App)
