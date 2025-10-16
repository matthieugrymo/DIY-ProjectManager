"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Edit2, Trash2, StickyNote, Calendar } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface Note {
  id: string
  title: string
  content: string
  category: "general" | "important" | "reminder" | "idea"
  createdAt: string
  updatedAt: string
}

interface ProjectNotesProps {
  projectId: string
}

// Mock data - in a real app this would come from a database
const mockNotes: Note[] = [
  {
    id: "1",
    title: "Tile Layout Pattern",
    content:
      "Remember to start from the center of the wall and work outward. Use a level line to ensure the first row is perfectly straight. The subway pattern should be offset by half a tile.",
    category: "important",
    createdAt: "2025-09-10T10:00:00Z",
    updatedAt: "2025-09-10T10:00:00Z",
  },
  {
    id: "2",
    title: "Grout Color Decision",
    content:
      "Considering white vs light gray grout. White will make tiles pop more but shows dirt easier. Light gray is more forgiving and still looks clean.",
    category: "idea",
    createdAt: "2025-09-08T14:30:00Z",
    updatedAt: "2025-09-08T14:30:00Z",
  },
  {
    id: "3",
    title: "Tool Rental Reminder",
    content: "Need to return the tile saw to Home Depot by Saturday. Rental period ends at 6 PM.",
    category: "reminder",
    createdAt: "2025-09-12T09:15:00Z",
    updatedAt: "2025-09-12T09:15:00Z",
  },
]

export function ProjectNotes({ projectId }: ProjectNotesProps) {
  const [notes, setNotes] = useState<Note[]>(mockNotes)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    category: "general" as Note["category"],
  })
  const { t } = useLanguage() // Added translation hook

  const handleAddNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setNotes((prev) => [note, ...prev])
    setNewNote({ title: "", content: "", category: "general" })
    setIsAddDialogOpen(false)
  }

  const handleEditNote = (note: Note) => {
    setEditingNote(note)
    setNewNote({
      title: note.title,
      content: note.content,
      category: note.category,
    })
  }

  const handleUpdateNote = () => {
    if (!editingNote || !newNote.title.trim() || !newNote.content.trim()) return

    setNotes((prev) =>
      prev.map((note) =>
        note.id === editingNote.id
          ? {
              ...note,
              title: newNote.title,
              content: newNote.content,
              category: newNote.category,
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    )

    setEditingNote(null)
    setNewNote({ title: "", content: "", category: "general" })
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: Note["category"]) => {
    switch (category) {
      case "important":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "reminder":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "idea":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getCategoryIcon = (category: Note["category"]) => {
    switch (category) {
      case "reminder":
        return <Calendar className="h-3 w-3" />
      default:
        return <StickyNote className="h-3 w-3" />
    }
  }

  const getCategoryName = (category: Note["category"]) => {
    switch (category) {
      case "important":
        return "Important"
      case "reminder":
        return "Rappel"
      case "idea":
        return "Idée"
      default:
        return "Général"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("notes.title")}</h2>
          <p className="text-muted-foreground">Gardez une trace des informations importantes, idées et rappels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t("notes.addNote")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Ajouter une Nouvelle Note</DialogTitle>
              <DialogDescription>Créer une nouvelle note pour votre projet</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={newNote.title}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Entrez le titre de la note..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Catégorie</Label>
                <select
                  id="category"
                  value={newNote.category}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, category: e.target.value as Note["category"] }))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="general">Général</option>
                  <option value="important">Important</option>
                  <option value="reminder">Rappel</option>
                  <option value="idea">Idée</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={newNote.content}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                  placeholder="Écrivez votre note ici..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                {t("button.cancel")}
              </Button>
              <Button onClick={handleAddNote}>Ajouter Note</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucune note pour l'instant</h3>
            <p className="text-muted-foreground text-center mb-4">
              Commencez à ajouter des notes pour garder une trace des informations importantes et idées pour votre
              projet.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter Votre Première Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{note.title}</CardTitle>
                    <Badge variant="secondary" className={`gap-1 ${getCategoryColor(note.category)}`}>
                      {getCategoryIcon(note.category)}
                      {getCategoryName(note.category)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleEditNote(note)} className="h-8 w-8 p-0">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteNote(note.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Créé le {formatDate(note.createdAt)}
                  {note.updatedAt !== note.createdAt && ` • Modifié le ${formatDate(note.updatedAt)}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{note.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Note Dialog */}
      <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Modifier la Note</DialogTitle>
            <DialogDescription>Mettre à jour les informations de votre note</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Titre</Label>
              <Input
                id="edit-title"
                value={newNote.title}
                onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Entrez le titre de la note..."
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-category">Catégorie</Label>
              <select
                id="edit-category"
                value={newNote.category}
                onChange={(e) => setNewNote((prev) => ({ ...prev, category: e.target.value as Note["category"] }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="general">Général</option>
                <option value="important">Important</option>
                <option value="reminder">Rappel</option>
                <option value="idea">Idée</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Contenu</Label>
              <Textarea
                id="edit-content"
                value={newNote.content}
                onChange={(e) => setNewNote((prev) => ({ ...prev, content: e.target.value }))}
                placeholder="Écrivez votre note ici..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              {t("button.cancel")}
            </Button>
            <Button onClick={handleUpdateNote}>Mettre à Jour Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
