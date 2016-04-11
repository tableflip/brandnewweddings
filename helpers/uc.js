function appendOp (url, op) {
  var parts = url.split('/')

  if (url[url.length - 1] === '/') {
    parts[parts.length - 1] = op
  } else {
    parts[parts.length - 1] = op + parts[parts.length - 1]
  }

  return parts.join('/')
}

module.exports = function (url, op) {
  if (!url) return ''
  if (url.indexOf('ucarecdn.com') < 0) return url // Not an uploadcare URL
  return appendOp(url, op)
}
