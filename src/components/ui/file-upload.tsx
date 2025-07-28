"use client"

import { JSX, useRef, useState } from "react"
import { Upload } from "lucide-react"

// Utility function to combine classnames
const cn = (...classes: (string | undefined | boolean)[]): string => {
  return classes.filter(Boolean).join(' ')
}

interface FileUploadProps {
  onChange?: (files: File[]) => void
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([])
  const [isDragActive, setIsDragActive] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles])
    if (onChange) {
      onChange(newFiles)
    }
  }

  const handleClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragActive(false)
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    
    if (droppedFiles.length > 0) {
      handleFileChange([droppedFiles[0]]) // Only take first file since multiple is false
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault()
    setIsDragActive(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFiles = e.target.files
    if (selectedFiles) {
      handleFileChange(Array.from(selectedFiles))
    }
  }

  return (
    <div 
      className="w-full"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        onClick={handleClick}
        className="p-10 group/file block rounded-lg cursor-pointer w-full relative overflow-hidden hover:shadow-lg transition-shadow"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          onChange={handleInputChange}
          className="hidden"
          accept=".xlsx"
        />
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="relative z-20 font-sans font-bold text-neutral-700 dark:text-neutral-300 text-base">
            Upload file
          </p>
          <p className="relative z-20 font-sans font-normal text-neutral-400 dark:text-neutral-400 text-base mt-2">
            Drag or drop your files here or click to upload
          </p>
          <div className="relative w-full mt-10 max-w-xl mx-auto">
            {files.length > 0 ? (
              files.map((file, idx) => (
                <div
                  key={`file-${idx}`}
                  className={cn(
                    "relative overflow-hidden z-40 bg-white dark:bg-neutral-900 flex flex-col items-start justify-start md:h-24 p-4 mt-4 w-full mx-auto rounded-md",
                    "shadow-sm",
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <p className="text-base text-neutral-700 dark:text-neutral-300 truncate max-w-xs">
                      {file.name}
                    </p>
                    <p className="rounded-lg px-2 py-1 w-fit shrink-0 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-white shadow-input">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <div className="flex text-sm md:flex-row flex-col items-start md:items-center w-full mt-2 justify-between text-neutral-600 dark:text-neutral-400">
                    <p className="px-1 py-0.5 rounded-md bg-gray-100 dark:bg-neutral-800">
                      {file.type}
                    </p>
                    <p>
                      modified {new Date(file.lastModified).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : null}
            
            {files.length === 0 ? (
              <div
                className={cn(
                  "relative group-hover/file:shadow-2xl z-40 bg-white dark:bg-neutral-900 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md transition-all duration-200",
                  "shadow-[0px_10px_50px_rgba(0,0,0,0.1)]",
                  isDragActive ? "transform translate-x-5 -translate-y-5 opacity-90" : ""
                )}
              >
                {isDragActive ? (
                  <p className="text-neutral-600 flex flex-col items-center">
                    Drop it
                    <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
                  </p>
                ) : (
                  <Upload className="h-4 w-4 text-neutral-600 dark:text-neutral-300" />
                )}
              </div>
            ) : null}
            
            {files.length === 0 ? (
              <div
                className={cn(
                  "absolute border border-dashed border-sky-400 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-md transition-opacity duration-200",
                  isDragActive ? "opacity-100" : "opacity-0"
                )}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export function GridPattern(): JSX.Element {
  const columns = 41
  const rows = 11
  
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          )
        })
      )}
    </div>
  )
}