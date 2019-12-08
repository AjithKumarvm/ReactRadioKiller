import React from 'react'
import './styles.scss'
import {CSSTransition} from 'react-transition-group'

export default class PlayListControls extends React.Component{
    state = {show: false}
    componentDidUpdate (prevProps) {
        const show = this.props.playerStatus === 'PLAYING'
        show !== this.state.show && this.setState({
            show
        })
    }
    render () {
        const classNames = ['playListTriangle']
        classNames.push(this.state.show ? 'play':'stop')
        return <CSSTransition in={this.state.show && this.props.current} timeout={300} className='playListTriangle'>
            <div />
        </CSSTransition> 
    }
}