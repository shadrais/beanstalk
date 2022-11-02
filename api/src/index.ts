import * as express from 'express'
import { Request, Response } from 'express'
import fileRouter from './routes/fileRoutes'
import * as cors from 'cors'
import errorMiddleware from './middleware/errorMiddleware'
import * as dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3000

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.status(200).send('Hello World!')
})

app.use('/api', fileRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log('Server is running on port 3000')
})
