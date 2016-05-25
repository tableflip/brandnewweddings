var fs = require('fs')
var path = require('path')
var async = require('async')
var packageJson = require('../package.json')
var inputDir = path.normalize(path.join(__dirname, '..', 'pages'))
var outputDir = path.normalize(__dirname)

async.waterfall([
  function read (done) {
    fs.readdir(inputDir, done)
  },
  function filter (contents, done) {
    var pages = contents.filter(function (item) {
      var pathToFile = path.join(inputDir, item)
      return fs.statSync(pathToFile).isDirectory()
    })
    done(null, pages)
  },
  function createUrls (pages, done) {
    var routes = pages.map(function (page) { return 'https://' + packageJson.config.deploy.prod + '/' + page })
    var sitemap = routes.join('\n').toString()
    var writePath = path.join(outputDir, 'sitemap.txt')
    fs.writeFile(writePath, sitemap, done)
  }
], function (err, result) {
  return err || console.log('Created sitemap.txt OK')
})
