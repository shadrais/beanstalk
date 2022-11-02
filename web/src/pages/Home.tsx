import React, { FormEvent, MouseEventHandler } from 'react'
import axios from 'axios'
import loadingGif from '../assets/loading.gif'

type Object = {
  timestamp: string
  loglevel: string
  transactionId: string
  err?: string
}

const Home = () => {
  const [file, setFile] = React.useState<Blob | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const exportData = (data: Object[]): void => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`
    const link = document.createElement('a')
    link.href = jsonString
    link.download = 'logs.json'
    link.click()
  }

  const handleSubmit = async (
    e: FormEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault()
    if (!file) return alert('Please select a file')
    if (file.type !== 'text/plain') return alert('Please select a .txt file')
    const formData = new FormData()
    formData.append('log', file)
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:3000/api/file', formData)
      console.log(res)
      exportData(res.data)
    } catch (err) {
      alert('Unable to process file')
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1>Beanstalk</h1>
      <div className='input-wrapper'>
        <input type='file' onChange={handleFile} max={1} accept='text/plain' />
        <button type='button' onClick={handleSubmit} disabled={loading}>
          {loading ? (
            <img src={loadingGif} alt='loading' height={24} />
          ) : (
            'Parse Log'
          )}
        </button>
      </div>
    </div>
  )
}

export default Home
