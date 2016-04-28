var $ = require('jquery')
var spinner = $('#modal-img').attr('src')
$('#modal').on('shown.bs.modal', function (e) {
  var src = $(e.relatedTarget).data('src')
  $('#modal-img').attr('src', src)
}).on('hidden.bs.modal', function (e) {
  $('#modal-img').attr('src', spinner)
})
