import React from 'react'
import './styles.scss'

export default class PlayerTimer extends React.PureComponent{
    componentDidMount () {
        this.now = Date.now()
    }

    render() {
        if (this.props.playerStatus !== 'PLAYING') {
            return null
        }
        const time = parseInt(this.props.playerTime / 1000)
        let seconds = `0${time % 60}`
        seconds = seconds.slice(-2)
        let minutes = `0${parseInt(time / 60)}`
        minutes = minutes.slice(-2)
        const text = ` ${minutes}:${seconds}`
        return <div className='PlayerTimer'>
            {text}
        </div>
    }
}