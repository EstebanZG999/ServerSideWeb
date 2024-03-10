import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const logRequest = (req, res, next) => {
  const { method, url, body } = req
  const start = new Date()

  res.on('finish', () => {
    const duration = new Date() - start
    const logMessage = `${start.toISOString()}, ${method} ${url}, Payload: ${JSON.stringify(body)}, Status: ${res.statusCode}, Duration: ${duration}ms\n`

    fs.appendFile(path.join(dirname, 'log.txt'), logMessage, (err) => {
      if (err) {
        console.error('Error logging request:', err)
      }
    })
  })

  next()
}

export default logRequest
