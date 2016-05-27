var fs = require('fs')
var path = require('path')
var async = require('async')
var packageJson = require('../package.json')
var inputDir = path.normalize(path.join(__dirname, '..', 'pages'))
var outputDir = path.normalize(path.join(__dirname, '..', 'dist'))

if (!packageJson.config.deploy.prod) throw new Error('Can\'t find packageJson.config.deploy.prod')

async.waterfall([
  function read (done) {
    fs.readdir(inputDir, done)
  },
  function filter (contents, done) {
    async.filter(contents, function (item, callback) {
      fs.stat(path.join(inputDir, item), function (err, stat) {
        if (err) return callback(err)
        callback(null, stat.isDirectory && item !== 'home')
      })
    }, done)
  },
  function createUrls (pages, done) {
    var routes = pages.map(function (page) { return 'https://' + packageJson.config.deploy.prod + '/' + page })
    var sitemap = routes.join('\n')
    var writePath = path.join(outputDir, 'sitemap.txt')
    fs.writeFile(writePath, sitemap, done)
  }
], function (err) {
  if (err) throw err
  console.log('Created dist/sitemap.txt')
})
