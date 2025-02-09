"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function FileUpload({ onFileUpload }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds the maximum limit of 10MB")
    } else {
      setFile(file)
      setError(null)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ".csv",
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:5000/api/predict", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "File upload failed")
      }

      const data = await response.json()
      onFileUpload(data)
      setUploading(false)
      setUploadProgress(100)
    } catch (error) {
      console.error("Error:", error)
      setError(error.message || "An error occurred while uploading the file. Please try again.")
      setUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? "border-white/50 bg-white/5" 
            : "border-white/30 hover:border-white/40"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-white/70" />
        <p className="mt-2 text-sm text-white/80">Drag and drop your CSV file here, or click to browse</p>
        <p className="mt-1 text-xs text-white/60">Supported format: CSV (max 10MB)</p>
      </div>
      {file && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-white/80">{file.name}</span>
          <Button 
            onClick={handleUpload} 
            disabled={uploading} 
            className="bg-white/10 hover:bg-white/20 text-white"
          >
            {uploading ? "Uploading..." : "Upload and Analyze"}
          </Button>
        </div>
      )}
      {uploading && <Progress value={uploadProgress} className="w-full bg-white/10" />}
      {error && (
        <Alert variant="destructive" className="bg-red-500/10 text-white border-red-500/20">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

