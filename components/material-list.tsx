"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Package, DollarSign, ShoppingCart, CheckCircle2, ListChecks, Copy, Download } from "lucide-react"
import { MaterialSelection } from "./material-selection"

interface Material {
  id: string
  name: string
  quantity: number
  unit: string
  cost?: number
  purchased: boolean
  supplier?: string
  notes?: string
}

interface MaterialListProps {
  materials: Material[]
  onMaterialsChange: (materials: Material[]) => void
}

export function MaterialList({ materials, onMaterialsChange }: MaterialListProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showMaterialSelection, setShowMaterialSelection] = useState(false)
  const [showWishlistDialog, setShowWishlistDialog] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    cost: 0,
    supplier: "",
    notes: "",
  })

  const togglePurchased = (materialId: string) => {
    const updatedMaterials = materials.map((material) =>
      material.id === materialId ? { ...material, purchased: !material.purchased } : material,
    )
    onMaterialsChange(updatedMaterials)
  }

  const addMaterial = () => {
    if (!newMaterial.name) return

    const material: Material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      quantity: newMaterial.quantity,
      unit: newMaterial.unit,
      cost: newMaterial.cost || undefined,
      purchased: false,
      supplier: newMaterial.supplier || undefined,
      notes: newMaterial.notes || undefined,
    }

    onMaterialsChange([...materials, material])
    setNewMaterial({
      name: "",
      quantity: 1,
      unit: "pieces",
      cost: 0,
      supplier: "",
      notes: "",
    })
    setShowAddDialog(false)
  }

  const handleMaterialSelect = (materialType: any, customDetails: any) => {
    const material: Material = {
      id: Date.now().toString(),
      name: materialType.name,
      quantity: customDetails.quantity,
      unit: materialType.unit,
      cost: customDetails.customCost,
      purchased: false,
      supplier: customDetails.supplier || undefined,
      notes: customDetails.notes || undefined,
    }

    onMaterialsChange([...materials, material])
  }

  const generateWishlist = () => {
    const neededMaterials = materials.filter((material) => !material.purchased)

    if (neededMaterials.length === 0) {
      return "All materials have been purchased! ✅"
    }

    let wishlistText = "🛠️ PROJECT MATERIALS WISHLIST\n"
    wishlistText += "=" + "=".repeat(35) + "\n\n"

    neededMaterials.forEach((material, index) => {
      wishlistText += `${index + 1}. ${material.name}\n`
      wishlistText += `   Quantity: ${material.quantity} ${material.unit}\n`
      if (material.cost) {
        wishlistText += `   Est. Cost: $${(material.cost * material.quantity).toFixed(2)} ($${material.cost.toFixed(2)} per ${material.unit})\n`
      }
      if (material.supplier) {
        wishlistText += `   Supplier: ${material.supplier}\n`
      }
      if (material.notes) {
        wishlistText += `   Notes: ${material.notes}\n`
      }
      wishlistText += "\n"
    })

    const totalCost = neededMaterials.reduce((acc, material) => acc + (material.cost || 0) * material.quantity, 0)
    if (totalCost > 0) {
      wishlistText += `💰 TOTAL ESTIMATED COST: $${totalCost.toFixed(2)}\n`
    }

    wishlistText += `📋 Total Items: ${neededMaterials.length}\n`
    wishlistText += `\nGenerated on: ${new Date().toLocaleDateString()}`

    return wishlistText
  }

  const copyWishlistToClipboard = async () => {
    const wishlistText = generateWishlist()
    try {
      await navigator.clipboard.writeText(wishlistText)
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy wishlist:", err)
    }
  }

  const downloadWishlist = () => {
    const wishlistText = generateWishlist()
    const blob = new Blob([wishlistText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `project-materials-wishlist-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const purchasedMaterials = materials.filter((material) => material.purchased)
  const neededMaterials = materials.filter((material) => !material.purchased)
  const totalCost = materials.reduce((acc, material) => acc + (material.cost || 0) * material.quantity, 0)
  const purchasedCost = purchasedMaterials.reduce((acc, material) => acc + (material.cost || 0) * material.quantity, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Project Materials</h2>
          <p className="text-muted-foreground">
            {purchasedMaterials.length} of {materials.length} materials purchased
          </p>
        </div>

        <div className="flex gap-2">
          {materials.length > 0 && (
            <Dialog open={showWishlistDialog} onOpenChange={setShowWishlistDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <ListChecks className="h-4 w-4" />
                  Create Wishlist
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Materials Wishlist</DialogTitle>
                  <DialogDescription>
                    Your complete materials list with quantities and estimated costs
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm whitespace-pre-wrap font-mono max-h-96 overflow-y-auto">
                      {generateWishlist()}
                    </pre>
                  </div>
                </div>

                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={copyWishlistToClipboard} className="gap-2 bg-transparent">
                    <Copy className="h-4 w-4" />
                    Copy to Clipboard
                  </Button>
                  <Button onClick={downloadWishlist} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download as File
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          <Button variant="outline" onClick={() => setShowMaterialSelection(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Browse Materials
          </Button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Custom Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Material</DialogTitle>
                <DialogDescription>Add a material needed for this project</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="material-name">Material Name</Label>
                  <Input
                    id="material-name"
                    value={newMaterial.name}
                    onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    placeholder="e.g., Subway Tiles (3x6 inch)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={newMaterial.quantity}
                      onChange={(e) => setNewMaterial({ ...newMaterial, quantity: Number.parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={newMaterial.unit}
                      onChange={(e) => setNewMaterial({ ...newMaterial, unit: e.target.value })}
                      placeholder="pieces, bags, bottles..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per Unit ($)</Label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newMaterial.cost}
                      onChange={(e) => setNewMaterial({ ...newMaterial, cost: Number.parseFloat(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier (Optional)</Label>
                    <Input
                      id="supplier"
                      value={newMaterial.supplier}
                      onChange={(e) => setNewMaterial({ ...newMaterial, supplier: e.target.value })}
                      placeholder="Home Depot, Lowes..."
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={newMaterial.notes}
                    onChange={(e) => setNewMaterial({ ...newMaterial, notes: e.target.value })}
                    placeholder="Any special requirements or notes..."
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={addMaterial}>Add Material</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Purchased</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${purchasedCost.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${(totalCost - purchasedCost).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {neededMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-orange-500" />
              Materials Needed ({neededMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {neededMaterials.map((material) => (
              <div
                key={material.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <Checkbox
                  checked={material.purchased}
                  onCheckedChange={() => togglePurchased(material.id)}
                  className="mt-1"
                />

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{material.name}</h4>
                    {material.cost && (
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <DollarSign className="h-3 w-3" />
                        {(material.cost * material.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {material.quantity} {material.unit}
                    </span>
                    {material.cost && (
                      <span>
                        ${material.cost.toFixed(2)} per {material.unit}
                      </span>
                    )}
                    {material.supplier && <Badge variant="outline">{material.supplier}</Badge>}
                  </div>

                  {material.notes && <p className="text-sm text-muted-foreground italic">{material.notes}</p>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {purchasedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              Purchased Materials ({purchasedMaterials.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {purchasedMaterials.map((material) => (
              <div key={material.id} className="flex items-start gap-4 p-4 border rounded-lg bg-muted/30">
                <Checkbox
                  checked={material.purchased}
                  onCheckedChange={() => togglePurchased(material.id)}
                  className="mt-1"
                />

                <div className="flex-1 space-y-2 opacity-75">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium line-through">{material.name}</h4>
                    {material.cost && (
                      <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                        <DollarSign className="h-3 w-3" />
                        {(material.cost * material.quantity).toFixed(2)}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>
                      {material.quantity} {material.unit}
                    </span>
                    {material.supplier && <Badge variant="outline">{material.supplier}</Badge>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <MaterialSelection
        open={showMaterialSelection}
        onOpenChange={setShowMaterialSelection}
        onMaterialSelect={handleMaterialSelect}
      />

      {materials.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No materials yet</h3>
            <p className="text-muted-foreground mb-4">Start by adding materials needed for this project</p>
            <Button onClick={() => setShowAddDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Material
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
