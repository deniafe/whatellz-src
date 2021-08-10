const fs = require('fs')
// read the file
const content = fs.readFileSync('./test.txt')
// print it
const data = content.toString().split(',').join('\n')
fs.writeFileSync('programming.txt', data)
