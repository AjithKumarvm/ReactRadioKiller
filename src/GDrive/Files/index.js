import React from 'react'
import { connect } from 'react-redux'
import { getFile } from '../api'

class Files extends React.Component {
  onFileClick = id => () => {
    const file = getFile(id)
    console.log('file', file)
  }
  sourceOpen = (id, mediaSource) => stream => {
    console.log('stream', stream, id)
    const file = getFile(id)
    mediaSource.addSourceBuffer(file)
    // const audio = new Audio(file) // the above
    // audio.play()
  }
  renderFile = ({ name, id }) => (
    <div onClick={this.onFileClick(id)}>{name}</div>
  )
  render () {
    return (
      <div>
        {this.props.files.map(file => (
          <this.renderFile {...file} key={file.id} />
        ))}
      </div>
    )
  }
}

export default connect(({ gDrive }) => ({
  files: gDrive.files
}))(Files)
