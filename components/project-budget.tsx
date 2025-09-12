"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
import { Plus, DollarSign, Calculator, FileText } from "lucide-react"

interface BudgetItem {
  id: string
  category: string
  name: string
  estimatedCost: number
  actualCost?: number
  included: boolean
  isProfessional?: boolean
  description?: string
}

interface ProjectBudgetProps {
  projectId: string
  budgetItems?: BudgetItem[]
  onBudgetChange?: (items: BudgetItem[]) => void
}

const defaultBudgetItems: BudgetItem[] = [
  {
    id: "1",
    category: "Preparation",
    name: "Surface Preparation",
    estimatedCost: 150,
    actualCost: 125,
    included: true,
    description: "Wall cleaning and primer application",
  },
  {
    id: "2",
    category: "Preparation",
    name: "Professional Consultation",
    estimatedCost: 200,
    included: false,
    isProfessional: true,
    description: "Expert assessment and planning",
  },
  {
    id: "3",
    category: "Materials",
    name: "Subway Tiles",
    estimatedCost: 300,
    actualCost: 285,
    included: true,
    description: "3x6 inch ceramic tiles",
  },
  {
    id: "4",
    category: "Materials",
    name: "Adhesive & Grout",
    estimatedCost: 75,
    included: true,
    description: "Tile adhesive and white grout",
  },
  {
    id: "5",
    category: "Installation",
    name: "Professional Installation",
    estimatedCost: 800,
    included: false,
    isProfessional: true,
    description: "Complete tile installation service",
  },
]

export function ProjectBudget({ projectId, budgetItems = defaultBudgetItems, onBudgetChange }: ProjectBudgetProps) {
  const [items, setItems] = useState<BudgetItem[]>(budgetItems)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newItem, setNewItem] = useState({
    category: "",
    name: "",
    estimatedCost: 0,
    description: "",
  })

  const includedItems = items.filter((item) => item.included)
  const totalEstimated = includedItems.reduce((sum, item) => sum + item.estimatedCost, 0)
  const totalActual = includedItems.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost), 0)
  const minEstimate = totalEstimated * 0.85
  const maxEstimate = totalEstimated * 1.15

  const toggleItemInclusion = (itemId: string) => {
    const updatedItems = items.map((item) => (item.id === itemId ? { ...item, included: !item.included } : item))
    setItems(updatedItems)
    onBudgetChange?.(updatedItems)
  }

  const addNewItem = () => {
    if (newItem.name && newItem.category && newItem.estimatedCost > 0) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        ...newItem,
        included: true,
      }
      const updatedItems = [...items, item]
      setItems(updatedItems)
      onBudgetChange?.(updatedItems)
      setNewItem({ category: "", name: "", estimatedCost: 0, description: "" })
      setShowAddDialog(false)
    }
  }

  const groupedItems = items.reduce(
    (acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = []
      }
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, BudgetItem[]>,
  )

  return (
    <div className="space-y-6">
      {/* Budget Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Budget Estimation
          </CardTitle>
          <CardDescription>Estimate and optimize your project budget</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2 mb-6">
            <div className="text-3xl font-bold">
              ${minEstimate.toFixed(0)} - ${maxEstimate.toFixed(0)}
            </div>
            <Badge variant="secondary">estimated</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground">Estimated Total</div>
              <div className="font-semibold">${totalEstimated.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-muted-foreground">Actual Spent</div>
              <div className="font-semibold">${totalActual.toLocaleString()}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Budget Categories */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, categoryItems], index) => (
          <Card key={category}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <CardTitle className="text-lg">{category}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {categoryItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      {item.isProfessional ? (
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <DollarSign className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        ${item.estimatedCost}
                        {item.isProfessional && " par un pro"}
                      </div>
                      {item.description && <div className="text-xs text-muted-foreground mt-1">{item.description}</div>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.included} onCheckedChange={() => toggleItemInclusion(item.id)} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add New Item */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <Plus className="h-4 w-4" />
            Add Budget Item
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Budget Item</DialogTitle>
            <DialogDescription>Add a new item to your project budget estimation.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                placeholder="e.g., Materials, Labor, Tools"
              />
            </div>
            <div>
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                placeholder="e.g., Ceramic Tiles"
              />
            </div>
            <div>
              <Label htmlFor="cost">Estimated Cost ($)</Label>
              <Input
                id="cost"
                type="number"
                value={newItem.estimatedCost}
                onChange={(e) => setNewItem({ ...newItem, estimatedCost: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="description">Description (Optional)</Label>
              <Input
                id="description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Brief description of the item"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={addNewItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Quote Button */}
      <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
        <FileText className="h-4 w-4" />
        Request Free Quote
      </Button>
    </div>
  )
}
