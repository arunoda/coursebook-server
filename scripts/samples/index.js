const fs = require('fs')
const path = require('path')
const fetch = require('node-fetch')

sendQuery()

// Core Functions

function loadCourses () {
  const courses = getFsList(__dirname, { onlyDirs: true })
  return courses
}

function loadLessions (course) {
  const courseDir = `${course.position}-${course.id}`
  const dir = path.join(__dirname, courseDir)
  const lessonList = getFsList(dir, { onlyFiles: true })
    .map(({ id, name, position }) => {
      const completeLession = require(path.join(dir, `${position}-${id}.js`))
      return Object.assign({ id, position, courseId: course.id }, completeLession)
    })

  return lessonList
}

function buildQuery () {
  const courses = loadCourses()
  const courseMutations = courses.map((c, i) => {
    return `
      c${i}: createCourse(
${toArgs(c, 8)}
      ) { id }
    `
  })

  let lessons = []
  courses.forEach((c) => {
    loadLessions(c).map((l) => lessons.push(l))
  })

  const lessionMutations = lessons.map((l, i) => {
    return `
      l${i}: createLesson(
${toArgs(l, 8)}
      ) { id, course { id } }
    `
  })

  const all = [...courseMutations, ...lessionMutations].join('\n')
  return `
    mutation {
      ${all}
    }
  `
}

function sendQuery() {
  const query = buildQuery()
  const { ROOT_URL, ADMIN_TOKEN } = process.env
  const url = `${ROOT_URL}/graphql?adminToken=${ADMIN_TOKEN}`
  const options = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query
    })
  }

  fetch(url, options)
    .then((res) => res.json())
    .then((res) => console.log(JSON.stringify(res, null, 2)))
    .catch((ex) => console.log(ex.stack))
}

// Utility functions

function toArgs (item, indent) {
  const itemContent = stringify(item, indent).trim()
  return itemContent.substring(1, itemContent.length - 1)
}

function spaces (n) {
  let str = ''
  for (let lc = 0; lc < n; lc++) {
    str += ' '
  }

  return str
}

function stringify (item, indent = '') {
  switch (typeof item) {
    case 'boolean':
    case 'number':
    case 'string':
      return JSON.stringify(item)
    default:
      if (item instanceof Array) {
        return `[${item.map((i) => stringify(i, indent + 2)).join(' ')}]`
      } else {
        const content = Object.keys(item).map((k) => {
          return `${spaces(indent + 2)}${k}: ${stringify(item[k], indent + 2)}`
        }).join('\n')
        return `\n${spaces(indent)}{\n${content}\n${spaces(indent)}}\n${spaces(indent - 2)}`
      }
  }
}

function getFsList (dir, options = {}) {
  const list = fs.readdirSync(dir)
    .filter((fileName) => {
      const fullFileName = path.join(dir, fileName)
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
      const id = parts.join('-').replace('.js', '')
      const name = parts.map((p) => `${p[0].toUpperCase()}${p.substring(1)}`)
        .join(' ')
        .replace('.js', '')

      return { id, name, position }
    })

  return list
}
