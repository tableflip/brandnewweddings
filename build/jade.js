var start = Date.now()
var fs = require('fs')
var path = require('path')
var find = require('find')
var jade = require('jade')
var async = require('async')
var mkdirp = require('mkdirp')
var slug = require('slug')
var extend = require('extend')
var pathExists = require('path-exists')
var requireDir = require('require-dir')
var packageSubPages = require('../package').subPages || {}

var helperPath = path.join(__dirname, '..', 'helpers')
var helpers = pathExists.sync(helperPath) ? requireDir(helperPath, { camelcase: true }) : {}
slug.defaults.mode = 'rfc3986'

var inputDir = path.normalize(path.join(__dirname, '..', 'pages'))
var outputDir = path.normalize(path.join(__dirname, '..', 'dist'))

find.file(/\index.jade$/, inputDir, (files) => {
  var tasks = files.map((tpl) => {
    var name = path.dirname(path.relative(inputDir, tpl))
    return {
      input: tpl,
      output: path.join(outputDir, name, 'index.html'),
      content: require(path.join(path.dirname(tpl), 'content.json')),
      meta: {
        name: name,
        relativePathToRoot: '..'
      }
    }
  })

  // shift output of home
  tasks
    .filter((task) => task.meta.name === 'home')
    .forEach((task) => {
      task.output = path.join(outputDir, 'index.html')
      task.meta.relativePathToRoot = '.'
    })

  // add tasks for any collection routes
  tasks
    .forEach((task) => {
      var subPageMeta = packageSubPages[task.meta.name]
      if (!subPageMeta) return
      var collection = task.content[subPageMeta.field]
      // Add tasks to build each subpage to the queue
      collection.forEach((entry, ind) => {
        entry._slug = slug(entry[subPageMeta.slugFrom])
        entry._index = ind
        var input = subPageMeta.template ? path.join(task.input, '..', `${subPageMeta.template}.jade`) : task.input
        tasks.push({
          input: input,
          output: path.join(outputDir, task.meta.name, `${entry._slug}.html`),
          content: extend({}, task.content, { _entry: entry }),
          meta: {
            name: `${task.name}/${entry._slug}`,
            relativePathToRoot: '..'
          }
        })
      })
    })

  tasks.forEach((task) => {
    var locals = {
      meta: task.meta,
      content: task.content,
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
