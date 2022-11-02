import * as express from 'express'
import * as multer from 'multer'
import { fileController } from '../controller/fileController'

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './api/src/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname)
  },
})

const upload = multer({ storage })

router.post('/file', upload.single('log'), fileController)

export default router
