var path = require('path')
var realWeddingsContent = require(path.join(__dirname, '..', 'pages/real-weddings/content.json'))

module.exports = {
  recent: function (number) {
    var weddings = realWeddingsContent.weddings
    return weddings && weddings.slice(0, number)
  }
}
