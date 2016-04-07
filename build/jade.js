var start = Date.now()
var fs = require('fs')
var path = require('path')
var find = require('find')
var jade = require('jade')
var async = require('async')
var mkdirp = require('mkdirp')
var slug = require('slug')
var extend = require('extend')
var md = require('markdown-it')({
  html: true,
  breaks: true,
  linkify: true
})

slug.defaults.mode = 'rfc3986'

var inputDir = path.normalize(path.join(__dirname, '..', 'pages'))
var outputDir = path.normalize(path.join(__dirname, '..', 'dist'))

find.file(/\index.jade$/, inputDir, (files) => {
  var tasks = files.map((tpl) => {
    var name = path.dirname(path.relative(inputDir, tpl))
    return {
      name: name,
      input: tpl,
      output: path.join(outputDir, name, 'index.html'),
      content: require(path.join(path.dirname(tpl), 'content.json')),
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

  // add tasks for any collection routes
  tasks
    .forEach((task) => {
      var collectionMeta = task.content.collection
      var collection = collectionMeta && task.content[collectionMeta.key]
      if (!collection) return
      // Add tasks to build each subpage to the queue
      collection.forEach((entry) => {
        entry.slug = slug(entry[collectionMeta.slugFrom])
        entry.path = path.join('/', task.name, `${entry.slug}.html`)
        tasks.push({
          name: `${task.name}/${entry.slug}`,
          input: task.input,
          output: path.join(outputDir, task.name, `${entry.slug}.html`),
          content: extend({}, task.content, { collectionEntry: entry }),
          meta: { relativePathToRoot: '..' }
        })
      })
    })

  tasks.forEach((task) => {
    var locals = {
      meta: task.meta,
      content: task.content,
      md: md,
      facts: require('../facts.json'),
      pretty: true
    }
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
