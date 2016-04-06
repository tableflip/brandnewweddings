/*
 * I grab sass variables from `facts.json` and compile the sass into css.
 * I pump the result to stdout so it can be streamed into postcss / autoprefixer
 *
 * Our custom vars are concatenated with the contents of main.scss and handed
 * over to sass. We provide the file path info so sass can figure out imports
 */

var fs = require('fs')
var path = require('path')
var sass = require('node-sass')
var base = path.normalize(path.join(__dirname, '..'))
var input = path.join(base, 'pages', 'main.scss')
var output = path.join(base, 'dist', 'bundle.css')
var facts = require('../facts.json')
var keys = ['brand-primary']

// pluck sass vars from facts and turn into a sass string
var sassVars = Object.keys(facts)
  .filter((k) => keys.indexOf(k) > -1)
  .map((k) => `$${k}: ${facts[k]};`)
  .join(' ')

// sync yolo.
var sassMain = fs.readFileSync(input, 'utf8')

var opts = {
  file: input,
  data: sassVars + sassMain,
  outFile: output,
  includePaths: [path.join(base, 'node_modules')],
  outputStyle: 'compact'
}

sass.render(opts, (err, res) => {
  if (err) throw err
  console.log(res.css.toString())
})
