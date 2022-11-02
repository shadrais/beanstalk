import { Request, Response, NextFunction } from 'express'

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  //   console.log(err)
  const status = res.statusCode === 200 ? 500 : res.statusCode
  res.status(status).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'development' && err.stack,
  })
}

export default errorMiddleware
