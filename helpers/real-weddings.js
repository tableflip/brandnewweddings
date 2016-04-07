var realWeddingsContent = require('../pages/real-weddings/content.json')

module.exports = {
  recent: function (number) {
    var weddings = realWeddingsContent.weddings
    return weddings && weddings.slice(0, number)
  }
}
