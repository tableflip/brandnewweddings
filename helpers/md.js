var md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
})
.use(require('markdown-it-container'), 'text-accent')

module.exports = md
