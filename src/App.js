import React from 'react'
import {Provider} from 'react-redux'
import { createStore } from 'redux'
import {reducer} from './reducer'
import './App.scss'
import PlayList from './PlayList'
import Player from './Player'
import Controls from './Controls'

const store = createStore(reducer)
window.store = store

class App extends React.PureComponent {
  player = React.createRef();
  play = (station) => {
    this.player.current.play(station)()
  }
  getPlayer = () => this.player.current
  render () {
    return (
      <div className='rkContainer'>
        <Provider store={store}>
          <Player ref={this.player} />
          <PlayList play={this.play} getPlayer={this.getPlayer} />
          <Controls getPlayer={this.getPlayer} />
        </Provider>
      </div>
    )
  }
}

export default App
