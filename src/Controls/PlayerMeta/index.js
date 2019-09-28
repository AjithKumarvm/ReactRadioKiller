import React from 'react'
import './styles.scss'

export default class PlayerMeta extends React.PureComponent {
    render () {
        const {image, title} = this.props.currentStation || {}
        return <div className='playerMeta'>
            <div className='icon' style={{backgroundImage: `url(${image})`}} />
            <div className='stationName'>{title}</div>
        </div>
    }
}