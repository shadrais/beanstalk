import { Request, Response } from 'express'
import * as fs from 'fs'

type Object = {
  timestamp: string
  loglevel: string
  transactionId: string
  err?: string
}

const fileController = (req: Request, res: Response) => {
  try {
    const file = req.file
    if (!file || file.mimetype !== 'text/plain') {
      const error = new Error('Please upload a file of type .txt')
      res.status(400)
      throw new Error(error.message)
    }
    const textFile = fs.readFileSync(req.file.path, 'utf8')
    const logs: Object[] = []

    // Check line break or empty line
    const lines = textFile.split(/\r?\n/)
    lines.forEach((line) => {
      if (line !== '') {
        // console.log(line)
        const [timestamp, loglevel, log] = line.split(' - ')

        const parsedLog = JSON.parse(log)
        if (
          isNaN(Date.parse(timestamp)) ||
          !loglevel ||
          !parsedLog.transactionId
        ) {
          res.status(400)
          throw new Error('Invalid log format')
        }
        const { transactionId, err } = parsedLog
        const obj: Object = {
          timestamp: Date.parse(timestamp).toString(),
          loglevel,
          transactionId,
          ...(err && { err }),
        }
        logs.push(obj)
      }
    })

    console.log(logs.length, 'logs')
    res.status(200).json(logs)
  } catch (error) {
    console.log(error)
    error.message = error.message.includes('JSON')
      ? 'Invalid log format'
      : error.message

    throw new Error(error.message)
  }
}

export { fileController }
