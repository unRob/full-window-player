var readline = require('readline')
const fs = require('fs')


var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

rl.on('line', function(line){
  const HTML = fs.readFileSync('docs/template.html')
    .toString()
    .replace('__BOOKMARKLET__',
      encodeURIComponent(line.replace(/\n/g, ''))
    )

  fs.writeFileSync('docs/public/index.html', HTML)
  process.exit(0)
})
