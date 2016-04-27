var portfolioContent = require('../pages/portfolio/content.json')

module.exports = {
  recent: function (number) {
    var weddings = portfolioContent.weddings
    return weddings && weddings.slice(0, number)
  }
}
