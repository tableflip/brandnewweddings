var $ = require('jquery')
var search = window.location.search

if (search) {
  var cssClass = ''

  if (search.indexOf('sent=true') > -1) {
    cssClass = 'sent-true'
  } else if (search.indexOf('sent=false') > -1) {
    cssClass = 'sent-false'
  }

  $('body').addClass(cssClass)
}
