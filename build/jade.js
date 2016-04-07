var start = Date.now()
var fs = require('fs')
var path = require('path')
var find = require('find')
var jade = require('jade')
var async = require('async')
var mkdirp = require('mkdirp')
var extend = require('extend')
var pathExists = require('path-exists')
var requireDir = require('require-dir')

var helperPath = path.join(__dirname, '..', 'helpers')
var helpers = pathExists.sync(helperPath) ? requireDir(helperPath, { camelcase: true }) : {}

var inputDir = path.normalize(path.join(__dirname, '..', 'pages'))
var outputDir = path.normalize(path.join(__dirname, '..', 'dist'))

find.file(/\index.jade$/, inputDir, (files) => {
  var tasks = files.map((tpl) => {
    var name = path.dirname(path.relative(inputDir, tpl))
    return {
      name: name,
      input: tpl,
      output: path.join(outputDir, name, 'index.html'),
      content: path.join(path.dirname(tpl), 'content.json'),
      meta: { relativePathToRoot: '..' }
    }
  })

  // shift output of home
  tasks
    .filter((task) => task.name === 'home')
    .forEach((task) => {
      task.output = path.join(outputDir, 'index.html')
      task.meta.relativePathToRoot = '.'
    })

  tasks.forEach((task) => {
    var locals = {
      meta: task.meta,
      content: require(task.content),
      facts: require('../facts.json'),
      pretty: true
    }
    extend(locals, helpers)
    task.html = jade.renderFile(task.input, locals)
  })

  async.each(tasks, (task, done) => {
    mkdirp(path.dirname(task.output), () => {
      fs.writeFile(task.output, task.html, {encoding: 'utf8'}, done)
    })
  }, (err) => {
    if (err) return console.error('build.js: ', err)
    console.log('Compiled %s templates in %sms', tasks.length, Date.now() - start)
  })
})
