"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Paintbrush, Zap, Wrench, TreePine, ToyBrick as Brick, Droplets, ArrowLeft, Plus } from "lucide-react"

interface MaterialType {
  id: string
  name: string
  category: string
  unit: string
  estimatedCost: number
  description: string
  suppliers: string[]
}

interface MaterialCategory {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  materials: MaterialType[]
}

const materialCategories: MaterialCategory[] = [
  {
    id: "flooring",
    name: "Flooring & Tiles",
    icon: <Brick className="h-6 w-6" />,
    color: "bg-orange-500",
    materials: [
      {
        id: "ceramic-tiles",
        name: "Ceramic Tiles",
        category: "flooring",
        unit: "sq ft",
        estimatedCost: 3.5,
        description: "Standard ceramic tiles for walls and floors",
        suppliers: ["Home Depot", "Lowes", "Tile Shop"],
      },
      {
        id: "porcelain-tiles",
        name: "Porcelain Tiles",
        category: "flooring",
        unit: "sq ft",
        estimatedCost: 5.25,
        description: "Durable porcelain tiles for high-traffic areas",
        suppliers: ["Home Depot", "Lowes", "Floor & Decor"],
      },
      {
        id: "hardwood-flooring",
        name: "Hardwood Flooring",
        category: "flooring",
        unit: "sq ft",
        estimatedCost: 8.75,
        description: "Solid hardwood flooring planks",
        suppliers: ["Lumber Liquidators", "Home Depot", "Local Suppliers"],
      },
      {
        id: "laminate-flooring",
        name: "Laminate Flooring",
        category: "flooring",
        unit: "sq ft",
        estimatedCost: 2.95,
        description: "Cost-effective laminate flooring",
        suppliers: ["Home Depot", "Lowes", "Costco"],
      },
    ],
  },
  {
    id: "paint",
    name: "Paint & Finishes",
    icon: <Paintbrush className="h-6 w-6" />,
    color: "bg-blue-500",
    materials: [
      {
        id: "interior-paint",
        name: "Interior Paint",
        category: "paint",
        unit: "gallon",
        estimatedCost: 45.0,
        description: "High-quality interior wall paint",
        suppliers: ["Sherwin Williams", "Benjamin Moore", "Home Depot"],
      },
      {
        id: "exterior-paint",
        name: "Exterior Paint",
        category: "paint",
        unit: "gallon",
        estimatedCost: 55.0,
        description: "Weather-resistant exterior paint",
        suppliers: ["Sherwin Williams", "Benjamin Moore", "Lowes"],
      },
      {
        id: "primer",
        name: "Primer",
        category: "paint",
        unit: "gallon",
        estimatedCost: 35.0,
        description: "Base coat primer for better paint adhesion",
        suppliers: ["Home Depot", "Lowes", "Sherwin Williams"],
      },
      {
        id: "wood-stain",
        name: "Wood Stain",
        category: "paint",
        unit: "quart",
        estimatedCost: 25.0,
        description: "Wood stain for natural wood finishes",
        suppliers: ["Home Depot", "Lowes", "Minwax"],
      },
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-yellow-500",
    materials: [
      {
        id: "electrical-wire",
        name: "Electrical Wire (12 AWG)",
        category: "electrical",
        unit: "feet",
        estimatedCost: 0.85,
        description: "Standard 12 gauge electrical wire",
        suppliers: ["Home Depot", "Lowes", "Electrical Supply"],
      },
      {
        id: "outlets",
        name: "Electrical Outlets",
        category: "electrical",
        unit: "pieces",
        estimatedCost: 3.5,
        description: "Standard duplex electrical outlets",
        suppliers: ["Home Depot", "Lowes", "Amazon"],
      },
      {
        id: "light-switches",
        name: "Light Switches",
        category: "electrical",
        unit: "pieces",
        estimatedCost: 2.25,
        description: "Standard toggle light switches",
        suppliers: ["Home Depot", "Lowes", "Amazon"],
      },
      {
        id: "circuit-breaker",
        name: "Circuit Breaker",
        category: "electrical",
        unit: "pieces",
        estimatedCost: 15.0,
        description: "20 amp circuit breaker",
        suppliers: ["Home Depot", "Lowes", "Electrical Supply"],
      },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing",
    icon: <Droplets className="h-6 w-6" />,
    color: "bg-cyan-500",
    materials: [
      {
        id: "pvc-pipe",
        name: "PVC Pipe",
        category: "plumbing",
        unit: "feet",
        estimatedCost: 1.25,
        description: "Standard PVC plumbing pipe",
        suppliers: ["Home Depot", "Lowes", "Plumbing Supply"],
      },
      {
        id: "pipe-fittings",
        name: "Pipe Fittings",
        category: "plumbing",
        unit: "pieces",
        estimatedCost: 3.75,
        description: "Various PVC pipe fittings and connectors",
        suppliers: ["Home Depot", "Lowes", "Plumbing Supply"],
      },
      {
        id: "faucet",
        name: "Kitchen Faucet",
        category: "plumbing",
        unit: "pieces",
        estimatedCost: 125.0,
        description: "Standard kitchen faucet with sprayer",
        suppliers: ["Home Depot", "Lowes", "Ferguson"],
      },
      {
        id: "toilet",
        name: "Toilet",
        category: "plumbing",
        unit: "pieces",
        estimatedCost: 185.0,
        description: "Standard two-piece toilet",
        suppliers: ["Home Depot", "Lowes", "Ferguson"],
      },
    ],
  },
  {
    id: "lumber",
    name: "Lumber & Wood",
    icon: <TreePine className="h-6 w-6" />,
    color: "bg-amber-600",
    materials: [
      {
        id: "2x4-lumber",
        name: "2x4 Lumber",
        category: "lumber",
        unit: "pieces",
        estimatedCost: 4.25,
        description: "Standard 8ft 2x4 construction lumber",
        suppliers: ["Home Depot", "Lowes", "Local Lumber Yard"],
      },
      {
        id: "plywood",
        name: "Plywood Sheet",
        category: "lumber",
        unit: "sheets",
        estimatedCost: 35.0,
        description: "4x8 ft plywood sheet (3/4 inch)",
        suppliers: ["Home Depot", "Lowes", "Local Lumber Yard"],
      },
      {
        id: "drywall",
        name: "Drywall Sheet",
        category: "lumber",
        unit: "sheets",
        estimatedCost: 12.5,
        description: "4x8 ft drywall sheet (1/2 inch)",
        suppliers: ["Home Depot", "Lowes", "Drywall Supply"],
      },
      {
        id: "insulation",
        name: "Insulation",
        category: "lumber",
        unit: "sq ft",
        estimatedCost: 1.15,
        description: "Fiberglass batt insulation",
        suppliers: ["Home Depot", "Lowes", "Insulation Supply"],
      },
    ],
  },
  {
    id: "hardware",
    name: "Hardware & Tools",
    icon: <Wrench className="h-6 w-6" />,
    color: "bg-gray-600",
    materials: [
      {
        id: "screws",
        name: "Wood Screws",
        category: "hardware",
        unit: "box",
        estimatedCost: 8.5,
        description: "Box of assorted wood screws",
        suppliers: ["Home Depot", "Lowes", "Amazon"],
      },
      {
        id: "nails",
        name: "Framing Nails",
        category: "hardware",
        unit: "box",
        estimatedCost: 12.0,
        description: "Box of framing nails",
        suppliers: ["Home Depot", "Lowes", "Local Hardware"],
      },
      {
        id: "hinges",
        name: "Door Hinges",
        category: "hardware",
        unit: "pieces",
        estimatedCost: 6.75,
        description: "Standard door hinges",
        suppliers: ["Home Depot", "Lowes", "Amazon"],
      },
      {
        id: "door-handle",
        name: "Door Handle Set",
        category: "hardware",
        unit: "pieces",
        estimatedCost: 25.0,
        description: "Complete door handle and lock set",
        suppliers: ["Home Depot", "Lowes", "Amazon"],
      },
    ],
  },
]

interface MaterialSelectionProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onMaterialSelect: (material: MaterialType, customDetails: any) => void
}

export function MaterialSelection({ open, onOpenChange, onMaterialSelect }: MaterialSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [customDetails, setCustomDetails] = useState({
    quantity: 1,
    supplier: "",
    notes: "",
    customCost: 0,
  })

  const filteredCategories = materialCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.materials.some((material) => material.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleMaterialSelect = (material: MaterialType) => {
    setSelectedMaterial(material)
    setCustomDetails({
      quantity: 1,
      supplier: material.suppliers[0] || "",
      notes: "",
      customCost: material.estimatedCost,
    })
  }

  const handleAddMaterial = () => {
    if (selectedMaterial) {
      onMaterialSelect(selectedMaterial, customDetails)
      setSelectedMaterial(null)
      setSelectedCategory(null)
      setCustomDetails({
        quantity: 1,
        supplier: "",
        notes: "",
        customCost: 0,
      })
      onOpenChange(false)
    }
  }

  const resetSelection = () => {
    setSelectedCategory(null)
    setSelectedMaterial(null)
    setSearchQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(selectedCategory || selectedMaterial) && (
              <Button variant="ghost" size="sm" onClick={resetSelection}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div>
              <DialogTitle>
                {selectedMaterial
                  ? "Configure Material"
                  : selectedCategory
                    ? "Select Material"
                    : "Choose Material Type"}
              </DialogTitle>
              <DialogDescription>
                {selectedMaterial
                  ? "Set quantity and customize details for your material"
                  : selectedCategory
                    ? "Pick a specific material from this category"
                    : "Browse material categories or search for specific items"}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {!selectedCategory && !selectedMaterial && (
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCategories.map((category) => (
                  <Card
                    key={category.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${category.color} text-white`}>{category.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.materials.length} materials</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1">
                        {category.materials.slice(0, 3).map((material) => (
                          <Badge key={material.id} variant="secondary" className="text-xs">
                            {material.name}
                          </Badge>
                        ))}
                        {category.materials.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{category.materials.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {selectedCategory && !selectedMaterial && (
            <div className="space-y-4">
              {(() => {
                const category = materialCategories.find((cat) => cat.id === selectedCategory)
                if (!category) return null

                return (
                  <>
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <div className={`p-2 rounded-lg ${category.color} text-white`}>{category.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold">{category.name}</h3>
                        <p className="text-muted-foreground">{category.materials.length} materials available</p>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {category.materials.map((material) => (
                        <Card
                          key={material.id}
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleMaterialSelect(material)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium">{material.name}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{material.description}</p>
                                <div className="flex items-center gap-4 mt-2">
                                  <Badge variant="outline">
                                    ${material.estimatedCost.toFixed(2)} per {material.unit}
                                  </Badge>
                                  <div className="flex gap-1">
                                    {material.suppliers.slice(0, 2).map((supplier) => (
                                      <Badge key={supplier} variant="secondary" className="text-xs">
                                        {supplier}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <Plus className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </>
                )
              })()}
            </div>
          )}

          {selectedMaterial && (
            <div className="space-y-6">
              <div className="pb-4 border-b">
                <h3 className="text-xl font-semibold">{selectedMaterial.name}</h3>
                <p className="text-muted-foreground">{selectedMaterial.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={customDetails.quantity}
                      onChange={(e) =>
                        setCustomDetails({
                          ...customDetails,
                          quantity: Number.parseInt(e.target.value) || 1,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">Unit: {selectedMaterial.unit}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost per {selectedMaterial.unit}</Label>
                    <Input
                      id="cost"
                      type="number"
                      min="0"
                      step="0.01"
                      value={customDetails.customCost}
                      onChange={(e) =>
                        setCustomDetails({
                          ...customDetails,
                          customCost: Number.parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Estimated: ${selectedMaterial.estimatedCost.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Supplier</Label>
                    <Input
                      id="supplier"
                      value={customDetails.supplier}
                      onChange={(e) =>
                        setCustomDetails({
                          ...customDetails,
                          supplier: e.target.value,
                        })
                      }
                      placeholder="Choose supplier..."
                    />
                    <div className="flex flex-wrap gap-1">
                      {selectedMaterial.suppliers.map((supplier) => (
                        <Button
                          key={supplier}
                          variant="outline"
                          size="sm"
                          className="h-6 text-xs bg-transparent"
                          onClick={() =>
                            setCustomDetails({
                              ...customDetails,
                              supplier: supplier,
                            })
                          }
                        >
                          {supplier}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={customDetails.notes}
                      onChange={(e) =>
                        setCustomDetails({
                          ...customDetails,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Any special requirements..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Total Cost:</span>
                  <span className="text-xl font-bold">
                    ${(customDetails.customCost * customDetails.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          {selectedMaterial && <Button onClick={handleAddMaterial}>Add Material</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
