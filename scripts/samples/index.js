const fs = require('fs')
const path = require('path')

function loadCourses() {
  const courses = getFsList({ onlyDirs: true })
  return courses
}

function getFsList(options = {}) {
  const list = fs.readdirSync(__dirname)
    .filter((fileName) => {
      const fullFileName = path.join(__dirname, fileName)
      const stat = fs.statSync(fullFileName)

      if (options.onlyDirs) {
        return stat.isDirectory()
      } else if (options.onlyFiles) {
        return stat.isFile()
      }

      return true
    })
    .map((dirName) => {
      const parts = dirName.split('-')
      const position = parseInt(parts.splice(0, 1)[0])
      const id = parts.join('-')
      const name = parts.map((p) => `${p[0].toUpperCase()}${p.substring(1)}`).join(' ')

      return { id, name, position }
    })

  return list
}

console.log('XXX', loadCourses())
