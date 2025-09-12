"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Upload, ImageIcon, FileIcon, Trash2, Download, Eye } from "lucide-react"

interface ProjectFile {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  url: string
  category: "photo" | "document" | "plan" | "receipt" | "other"
}

interface ProjectFilesProps {
  projectId: string
}

// Mock data - in a real app this would come from a database
const mockFiles: ProjectFile[] = [
  {
    id: "1",
    name: "kitchen-before.jpg",
    type: "image/jpeg",
    size: 2048576,
    uploadDate: "2025-09-10",
    url: "/kitchen-backsplash-installation.jpg",
    category: "photo",
  },
  {
    id: "2",
    name: "tile-receipt.pdf",
    type: "application/pdf",
    size: 156789,
    uploadDate: "2025-09-08",
    url: "#",
    category: "receipt",
  },
  {
    id: "3",
    name: "installation-guide.pdf",
    type: "application/pdf",
    size: 3456789,
    uploadDate: "2025-09-05",
    url: "#",
    category: "document",
  },
]

export function ProjectFiles({ projectId }: ProjectFilesProps) {
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [category, setCategory] = useState<ProjectFile["category"]>("photo")

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getFileIcon = (type: string, category: ProjectFile["category"]) => {
    if (type.startsWith("image/") || category === "photo") {
      return <ImageIcon className="h-5 w-5 text-blue-500" />
    }
    return <FileIcon className="h-5 w-5 text-gray-500" />
  }

  const getCategoryColor = (category: ProjectFile["category"]) => {
    const colors = {
      photo: "bg-blue-100 text-blue-800",
      document: "bg-green-100 text-green-800",
      plan: "bg-purple-100 text-purple-800",
      receipt: "bg-yellow-100 text-yellow-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category]
  }

  const handleFileUpload = () => {
    if (!selectedFiles) return

    Array.from(selectedFiles).forEach((file) => {
      const newFile: ProjectFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        uploadDate: new Date().toISOString().split("T")[0],
        url: URL.createObjectURL(file), // In a real app, this would be uploaded to a server
        category: category,
      }
      setFiles((prev) => [...prev, newFile])
    })

    setSelectedFiles(null)
    setIsUploadOpen(false)
  }

  const handleDeleteFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const groupedFiles = files.reduce(
    (acc, file) => {
      if (!acc[file.category]) {
        acc[file.category] = []
      }
      acc[file.category].push(file)
      return acc
    },
    {} as Record<ProjectFile["category"], ProjectFile[]>,
  )

  return (
    <div className="space-y-6">
      {/* Header with upload button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Project Files</h3>
          <p className="text-sm text-muted-foreground">
            Upload photos, documents, plans, and receipts for your project
          </p>
        </div>
        <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>Add photos, documents, or other files to your project</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-category">Category</Label>
                <select
                  id="file-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProjectFile["category"])}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="photo">Photo</option>
                  <option value="document">Document</option>
                  <option value="plan">Plan/Blueprint</option>
                  <option value="receipt">Receipt</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file-upload">Select Files</Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="cursor-pointer"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleFileUpload} disabled={!selectedFiles}>
                Upload Files
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* File categories */}
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([categoryKey, categoryFiles]) => (
          <Card key={categoryKey}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base capitalize flex items-center gap-2">
                {categoryKey === "photo" && <ImageIcon className="h-4 w-4" />}
                {categoryKey === "document" && <FileIcon className="h-4 w-4" />}
                {categoryKey === "plan" && <FileIcon className="h-4 w-4" />}
                {categoryKey === "receipt" && <FileIcon className="h-4 w-4" />}
                {categoryKey === "other" && <FileIcon className="h-4 w-4" />}
                {categoryKey} ({categoryFiles.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryFiles.map((file) => (
                  <div key={file.id} className="border rounded-lg p-4 space-y-3">
                    {/* File preview */}
                    {file.type.startsWith("image/") ? (
                      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gray-50 rounded-md flex items-center justify-center">
                        {getFileIcon(file.type, file.category)}
                      </div>
                    )}

                    {/* File info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-medium text-sm truncate" title={file.name}>
                          {file.name}
                        </h4>
                        <Badge className={`text-xs ${getCategoryColor(file.category)}`}>{file.category}</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>{formatFileSize(file.size)}</div>
                        <div>Uploaded {new Date(file.uploadDate).toLocaleDateString()}</div>
                      </div>
                    </div>

                    {/* File actions */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1 bg-transparent">
                        <Eye className="h-3 w-3" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 bg-transparent">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => handleDeleteFile(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {files.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">No files uploaded yet</h3>
                <p className="text-sm text-muted-foreground">
                  Start by uploading photos, documents, or other project files
                </p>
              </div>
              <Button onClick={() => setIsUploadOpen(true)} className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Your First File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
