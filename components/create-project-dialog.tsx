"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { useLanguage } from "@/contexts/language-context"

interface CreateProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onProjectCreated: (project: any) => void
}

interface BudgetItem {
  id: string
  name: string
  category: string
  estimatedCost: number
  isIncluded: boolean
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<"planning" | "in-progress">("planning")
  const [dueDate, setDueDate] = useState<Date>()

  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([])
  const [newItemName, setNewItemName] = useState("")
  const [newItemCategory, setNewItemCategory] = useState("")
  const [newItemCost, setNewItemCost] = useState("")
  const { t } = useLanguage() // Added translation hook

  const calculateTotalBudget = () => {
    return budgetItems.filter((item) => item.isIncluded).reduce((total, item) => total + item.estimatedCost, 0)
  }

  const addBudgetItem = () => {
    if (!newItemName || !newItemCategory || !newItemCost) return

    const newItem: BudgetItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: newItemCategory,
      estimatedCost: Number.parseFloat(newItemCost),
      isIncluded: true,
    }

    setBudgetItems([...budgetItems, newItem])
    setNewItemName("")
    setNewItemCategory("")
    setNewItemCost("")
  }

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter((item) => item.id !== id))
  }

  const toggleBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.map((item) => (item.id === id ? { ...item, isIncluded: !item.isIncluded } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description || !dueDate) return

    const newProject = {
      title,
      description,
      progress: 0,
      status,
      dueDate: dueDate.toISOString().split("T")[0],
      tasksCompleted: 0,
      totalTasks: 0,
      materialsNeeded: 0,
      budget: calculateTotalBudget(),
      budgetItems: budgetItems,
      image: `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(title + " DIY project")}`,
    }

    onProjectCreated(newProject)

    // Reset form
    setTitle("")
    setDescription("")
    setStatus("planning")
    setDueDate(undefined)
    setBudgetItems([])
    setNewItemName("")
    setNewItemCategory("")
    setNewItemCost("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("projects.createNew")}</DialogTitle>
          <DialogDescription>
            Commencez à planifier votre prochain projet DIY avec estimation budgétaire.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du Projet</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="ex: Installation de Dosseret de Cuisine"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t("projects.description")}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brève description de votre projet..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("projects.status")}</Label>
              <Select value={status} onValueChange={(value: "planning" | "in-progress") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">{t("status.planning")}</SelectItem>
                  <SelectItem value="in-progress">{t("status.inprogress")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t("projects.dueDate")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Choisir une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Estimation Budgétaire</Label>
              <div className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-emerald-600">${calculateTotalBudget().toFixed(2)}</span>
              </div>
            </div>

            {/* Add new budget item */}
            <div className="grid grid-cols-12 gap-2 items-end">
              <div className="col-span-4">
                <Label className="text-xs">Nom de l'Article</Label>
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="ex: Carreaux"
                  className="h-8"
                />
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Catégorie</Label>
                <Select value={newItemCategory} onValueChange={setNewItemCategory}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="materials">Matériaux</SelectItem>
                    <SelectItem value="tools">Outils</SelectItem>
                    <SelectItem value="labor">Main-d'œuvre</SelectItem>
                    <SelectItem value="permits">Permis</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label className="text-xs">Coût ($)</Label>
                <Input
                  type="number"
                  value={newItemCost}
                  onChange={(e) => setNewItemCost(e.target.value)}
                  placeholder="0.00"
                  className="h-8"
                />
              </div>
              <div className="col-span-2">
                <Button type="button" onClick={addBudgetItem} size="sm" className="h-8 w-full">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Budget items list */}
            {budgetItems.length > 0 && (
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {budgetItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={item.isIncluded}
                        onChange={() => toggleBudgetItem(item.id)}
                        className="rounded border-gray-300"
                      />
                      <div>
                        <div className="text-sm font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">${item.estimatedCost.toFixed(2)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBudgetItem(item.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("button.cancel")}
            </Button>
            <Button type="submit">Créer Projet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
