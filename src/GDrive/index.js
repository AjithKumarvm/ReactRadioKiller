import React from 'react'
import { connect } from 'react-redux'
import { initGDrive, getAccess, signOut } from './api'
import { updateLoginStatus } from '../actions'
import Files from './Files'

class GDrive extends React.Component {
  componentDidMount () {
    if (window.gapi) {
      console.log('loaded properly')
      this.props.initGDrive()
    } else {
      console.log('might load')
      window.globals.initGDrive = this.props.initGDrive
    }
    this.player = this.props.getPlayer()
  }
  renderAuth = {
      access_denied: () => <button onClick={getAccess}>SIGN IN</button>,
      access_granted: () => <button onClick={signOut}>SIGN OUT</button>,
      loading: () => <span>loading..</span>
  }
  render () {
    return (
      <>
        {this.renderAuth[this.props.loginStatus]()}
        <Files player={this.player} />
      </>
    )
  }
}

export default connect(
  ({ gDrive }) => ({
    loginStatus: gDrive.loginStatus
  }),
  dispatch => ({
    updateLoginStatus: () => {
      dispatch(updateLoginStatus('loading'))
    },
    initGDrive: () => {
      initGDrive(dispatch)
    }
  })
)(GDrive)
