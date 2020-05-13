// self.addEventListener('fetch', function(event) {
//     console.log('Service WORKER', event)
//     if(event.request.url.includes('googleapis.com/drive/v3/files')) {
//       event.respondWith(
//           fetch(event.request.url, {
//               method: "GET",
//               headers: {
//                   "Authorization": "Bearer " + window.gapi.auth2
//                   .getAuthInstance()
//                   .currentUser.get()
//                   .getAuthResponse().access_token,
//               },
//               redirect: "follow"
//           })
//       );
//     }
//   });

// console.log('running')

self.addEventListener('activate', function (event) {
  console.log('SW activate', event)
  event.waitUntil(self.clients.claim())
})

var parseUrl = (val, url) => {
  let result = null
  let tmp = []
  url = url.split('?')[1]
  if (!url) return result
  url = url.split('&')
  if (!url) return result
  url.forEach(function (item) {
    tmp = item.split('=')
    if (tmp[0] === val) result = decodeURIComponent(tmp[1])
  })
  return result
}

self.addEventListener('fetch', event => {
  console.log('fetch', event, event.request.headers)
  var accessToken = parseUrl('token', event.request.url)
  accessToken && console.log('accessToken', accessToken)
  if(accessToken) {
    event.respondWith(
      fetch(event.request.url, {
        headers: new Headers({
          ...event.request.headers,
          'Authorization': 'Bearer ' + accessToken
        })
      })
    )
  }
})
