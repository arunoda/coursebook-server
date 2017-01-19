const fs = require('fs')
const path = require('path')

function loadCourses() {
  const courses = fs.readdirSync(__dirname)
    .filter((fileName) => {
      const fullFileName = path.join(__dirname, fileName)
      return fs.statSync(fullFileName).isDirectory()
    })
    .map((dirName) => {
      const parts = dirName.split('-')
      const position = parseInt(parts.splice(0, 1)[0])
      const id = parts.join('-')
      const name = parts.map((p) => `${p[0].toUpperCase()}${p.substring(1)}`).join(' ')

      return { id, name, position }
    })

  return courses
}

console.log(loadCourses())
