import {
  DISCOVERY_DOCS,
  SCOPES,
  GDRIVE_API_KEY,
  GDRIVE_CLIENT_ID
} from './constants'
import { updateLoginStatus, updateFiles } from './../actions'

export const initGDrive = dispatch => {
  console.log('initGDrive api')
  window.gapi.load('client:auth2', initClient(dispatch))
}

const initClient = dispatch => () => {
  window.gapi.client
    .init({
      apiKey: GDRIVE_API_KEY,
      clientId: GDRIVE_CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    })
    .then(
      () => {
        // Listen for sign-in state changes.
        window.gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus(dispatch))

        // Handle the initial sign-in state.
        updateSigninStatus(dispatch)(
          window.gapi.auth2.getAuthInstance().isSignedIn.get()
        )
        // authorizeButton.onclick = handleAuthClick
        // signoutButton.onclick = handleSignoutClick
      },
      error => {
        // appendPre(JSON.stringify(error, null, 2))
        console.error('error', error)
        dispatch(updateLoginStatus('access_denied'))
        // getAccess()
      }
    )
}

const updateSigninStatus = dispatch => isSignedIn => {
  if (isSignedIn) {
    //   authorizeButton.style.display = 'none';
    //   signoutButton.style.display = 'block';
    //   listFiles();
    console.log('Access Granted')
    dispatch(updateLoginStatus('access_granted'))
    listFiles(dispatch)
  } else {
    //   authorizeButton.style.display = 'block';
    //   signoutButton.style.display = 'none';
    console.log('Access Denied')
    dispatch(updateLoginStatus('access_denied'))
  }
}

export const getAccess = () => {
  window.gapi.auth2.getAuthInstance().signIn()
}

export const signOut = () => {
  window.gapi.auth2.getAuthInstance().signOut()
}

export const listFiles = dispatch => {
  window.gapi.client.drive.files
    .list({
      //   'fields': "nextPageToken, files(id, name)"
      fields: 'nextPageToken, files(id, name)',
      q: "mimeType contains 'audio/'"
    })
    .then(function (response) {
      console.log('response', response)
      dispatch(updateFiles(response.result))
      //   appendPre('Files:');
      //   var files = response.result.files;
      //   if (files && files.length > 0) {
      //     for (var i = 0; i < files.length; i++) {
      //       var file = files[i];
      //       appendPre(file.name + ' (' + file.id + ')');
      //     }
      //   } else {
      //     appendPre('No files found.');
      //   }
    })
}

export const getFile = fileId => {
    // streamFile()

    var accessToken = window.gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse().access_token // or this: gapi.auth.getToken().access_token;
    
    const audio = new Audio() // the above
    audio.src = 'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media&token='+accessToken
    audio.play()
    return
  var accessToken = window.gapi.auth2
    .getAuthInstance()
    .currentUser.get()
    .getAuthResponse().access_token // or this: gapi.auth.getToken().access_token;
  var xhr = new XMLHttpRequest()
  xhr.open(
    'GET',
    'https://www.googleapis.com/drive/v3/files/' + fileId + '?alt=media',
    true
  )
  xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
  xhr.onload = function () {
    // var blob = new Blob([xhr.response], { type: 'audio/ogg' })
    // var objectUrl = URL.createObjectURL(blob)
    // var audio = new Audio()
    // audio.src = objectUrl
    // audio.onload = function (evt) {
    //   URL.revokeObjectURL(objectUrl)
    // }
    // audio.play()
  }
  let started = false
  xhr.onreadystatechange = function (e) {
    if (e.currentTarget.readyState === 3) {
      console.log('e.currentTarget.response', e.currentTarget.response)
      var blob = new Blob([xhr.response], { type: 'audio/m4a' })
      console.log('blob', blob)
      var objectUrl = URL.createObjectURL(blob)
      var audio = new Audio()
      audio.src = objectUrl
      // Release resource when it's loaded
      audio.onload = function (evt) {
        URL.revokeObjectURL(objectUrl)
      }
      audio.play()
      started = true
    }
  }
  //   xhr.responseType = 'arraybuffer'
  xhr.send()
}

const streamFile = () => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET', '/out.mp3', true)
  //   xhr.responseType = 'arraybuffer'
  //   xhr.onload = function (e) {
  //     var audio = document.getElementById('player')
  //     var codes = new Uint8Array(xhr.response)
  //     console.log('onload', e.currentTarget.response)

  //     // Get binary string from UTF-16 code units
  //     var bin = String.fromCharCode.apply(null, codes)

  //     // Convert binary to Base64
  //     var b64 = btoa(bin)
  //     console.log('b44', b64) // -> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
  //     audio.src = 'data:audio/flac;base64,' + b64
  //     audio.play()
  //   }
  let started = false
  let fileStream = ''

  xhr.onload = function (e) {
    // console.log('fileStream onload', e.currentTarget.response)
    // playFile(e.currentTarget.response)
  }
  xhr.onreadystatechange = function (e) {
    if (e.currentTarget.readyState === 4) {
        console.log('e.currentTarget.response', e.currentTarget.response)
        var instanceOfFileReader = new FileReader()
        var blob = new Blob([e.currentTarget.response], { type: 'audio/flac' })
        instanceOfFileReader.onload = (e) => {
            console.log('onload', e)
            playFile(e.currentTarget.result)
        }
        instanceOfFileReader.readAsArrayBuffer(blob);

        fileStream+=e.currentTarget.response
        console.log('fileStream length', fileStream.length)
    }
    if (e.currentTarget.readyState === 4) {
        console.log('fileStream length final', fileStream.length)
        // playFile(e.currentTarget.response)
    }
  }
//   xhr.responseType = 'arraybuffer'
  xhr.send()
}

// streamFile()

const playFile = response => {
  var audio = document.getElementById('player')
  var codes = new Uint8Array(response)

  // Get binary string from UTF-16 code units
  var bin = String.fromCharCode.apply(null, codes)

  // Convert binary to Base64
  var b64 = btoa(bin)
  console.log('b44', b64) // -> "R0lGODdhAQABAPAAAP8AAAAAACwAAAAAAQABAAACAkQBADs="
  audio.src = 'data:audio/flac;base64,' + b64
  audio.play()
}

const playBlobFile = response => {
    var blob = new Blob([response], { type: 'audio/flac' })
    var objectUrl = URL.createObjectURL(blob)
    var audio = new Audio()
    audio.src = objectUrl
    audio.onload = function (evt) {
      URL.revokeObjectURL(objectUrl)
    }
    audio.play()
}
