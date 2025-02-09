"use client"

import { useState } from "react"
import { useDropzone } from "react-dropzone"

const FileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null)

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("File upload failed")
      }

      const data = await response.json()
      onFileUpload(data)
    } catch (error) {
      console.error("Error:", error)
    }
  }

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the CSV file here...</p>
        ) : (
          <p>Drag and drop a CSV file here, or click to select a file</p>
        )}
      </div>
      {file && (
        <div>
          <p>Selected file: {file.name}</p>
          <button onClick={handleUpload}>Upload and Predict</button>
        </div>
      )}
    </div>
  )
}

export default FileUpload

