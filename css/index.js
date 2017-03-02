const fs = require('fs')
const { sync } = require('glob')

let defaults = []
const data = sync('css/*.css').reduce( (m, f) => {
  const domain = f.split('/').pop().replace('.css', '')
  const rules = fs.readFileSync(f)
    .toString()
    .replace(/([:{};])[\s\n]+/g, '$1')
    .replace(/}/g, '}\n')
    .replace(/\s*([!}{])/g, '$1')
    .split('\n')
    .filter( l => l )

  if (domain === '_default') {
    defaults = rules
    return m
  }

  m.push({ domain, rules })
  return m
}, [])

console.log(
  `const __DEFAULT_RULES__ = ${JSON.stringify(defaults)};
const __RULES__ = ${JSON.stringify(data)};
`)