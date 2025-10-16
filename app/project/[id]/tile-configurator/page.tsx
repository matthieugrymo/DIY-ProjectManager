"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calculator, Copy, Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import Link from "next/link"

interface TileCalculation {
  roomArea: number
  tileArea: number
  tilesNeeded: number
  tilesWithWaste: number
  wastePercentage: number
}

export default function TileConfiguratorPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()

  // Room dimensions
  const [roomLength, setRoomLength] = useState<string>("")
  const [roomWidth, setRoomWidth] = useState<string>("")

  // Tile dimensions
  const [tileLength, setTileLength] = useState<string>("30")
  const [tileWidth, setTileWidth] = useState<string>("15")

  // Configuration options
  const [wastePercentage, setWastePercentage] = useState<string>("10")
  const [groutWidth, setGroutWidth] = useState<string>("2")

  const [calculation, setCalculation] = useState<TileCalculation | null>(null)
  const [isCopied, setIsCopied] = useState(false)

  const calculateTiles = () => {
    const roomL = Number.parseFloat(roomLength)
    const roomW = Number.parseFloat(roomWidth)
    const tileL = Number.parseFloat(tileLength) / 100 // Convert cm to meters
    const tileW = Number.parseFloat(tileWidth) / 100 // Convert cm to meters
    const waste = Number.parseFloat(wastePercentage)

    if (!roomL || !roomW || !tileL || !tileW) return

    const roomArea = roomL * roomW
    const tileArea = tileL * tileW
    const tilesNeeded = Math.ceil(roomArea / tileArea)
    const tilesWithWaste = Math.ceil(tilesNeeded * (1 + waste / 100))

    setCalculation({
      roomArea,
      tileArea,
      tilesNeeded,
      tilesWithWaste,
      wastePercentage: waste,
    })
  }

  const copyResults = async () => {
    if (!calculation) return

    const results = `
Calcul de Carreaux - Projet ${params.id}
=====================================
Surface de la pièce: ${calculation.roomArea.toFixed(2)} m²
Surface par carreau: ${(calculation.tileArea * 10000).toFixed(2)} cm²
Carreaux nécessaires: ${calculation.tilesNeeded}
Avec ${calculation.wastePercentage}% de perte: ${calculation.tilesWithWaste}
Carreaux supplémentaires: ${calculation.tilesWithWaste - calculation.tilesNeeded}
    `.trim()

    try {
      await navigator.clipboard.writeText(results)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const downloadResults = () => {
    if (!calculation) return

    const results = `
Calcul de Carreaux - Projet ${params.id}
=====================================
Date: ${new Date().toLocaleDateString("fr-FR")}

Dimensions de la pièce:
- Longueur: ${roomLength} m
- Largeur: ${roomWidth} m
- Surface totale: ${calculation.roomArea.toFixed(2)} m²

Dimensions des carreaux:
- Longueur: ${tileLength} cm
- Largeur: ${tileWidth} cm
- Surface par carreau: ${(calculation.tileArea * 10000).toFixed(2)} cm²

Calculs:
- Carreaux nécessaires (théorique): ${calculation.tilesNeeded}
- Pourcentage de perte: ${calculation.wastePercentage}%
- Carreaux avec perte: ${calculation.tilesWithWaste}
- Carreaux supplémentaires à prévoir: ${calculation.tilesWithWaste - calculation.tilesNeeded}

Recommandations:
- Commandez toujours quelques carreaux supplémentaires pour les réparations futures
- Vérifiez que tous les carreaux proviennent du même lot pour éviter les variations de couleur
- Prévoyez des outils de coupe adaptés pour les découpes nécessaires
    `.trim()

    const blob = new Blob([results], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `calcul-carreaux-projet-${params.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href={`/project/${params.id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour au Projet
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Configurateur de Carreaux
            </CardTitle>
            <CardDescription>Calculez le nombre de carreaux nécessaires pour votre projet</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Room Dimensions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dimensions de la Pièce</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="room-length">Longueur (m)</Label>
                  <Input
                    id="room-length"
                    type="number"
                    step="0.01"
                    placeholder="3.50"
                    value={roomLength}
                    onChange={(e) => setRoomLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="room-width">Largeur (m)</Label>
                  <Input
                    id="room-width"
                    type="number"
                    step="0.01"
                    placeholder="2.40"
                    value={roomWidth}
                    onChange={(e) => setRoomWidth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Tile Dimensions */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Dimensions des Carreaux</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tile-length">Longueur (cm)</Label>
                  <Input
                    id="tile-length"
                    type="number"
                    step="0.1"
                    value={tileLength}
                    onChange={(e) => setTileLength(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tile-width">Largeur (cm)</Label>
                  <Input
                    id="tile-width"
                    type="number"
                    step="0.1"
                    value={tileWidth}
                    onChange={(e) => setTileWidth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Configuration Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Options</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="waste-percentage">Perte (%)</Label>
                  <Input
                    id="waste-percentage"
                    type="number"
                    min="5"
                    max="20"
                    value={wastePercentage}
                    onChange={(e) => setWastePercentage(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grout-width">Largeur Joint (mm)</Label>
                  <Input
                    id="grout-width"
                    type="number"
                    min="1"
                    max="10"
                    value={groutWidth}
                    onChange={(e) => setGroutWidth(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button onClick={calculateTiles} className="w-full" size="lg">
              <Calculator className="h-4 w-4 mr-2" />
              Calculer
            </Button>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats du Calcul</CardTitle>
            <CardDescription>Nombre de carreaux nécessaires pour votre projet</CardDescription>
          </CardHeader>
          <CardContent>
            {calculation ? (
              <div className="space-y-6">
                {/* Main Results */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{calculation.roomArea.toFixed(2)} m²</div>
                    <div className="text-sm text-blue-600">Surface Totale</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{calculation.tilesWithWaste}</div>
                    <div className="text-sm text-green-600">Carreaux à Acheter</div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Carreaux nécessaires (théorique)</span>
                    <span className="font-medium">{calculation.tilesNeeded}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Perte ({calculation.wastePercentage}%)</span>
                    <span className="font-medium">+{calculation.tilesWithWaste - calculation.tilesNeeded}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-muted-foreground">Surface par carreau</span>
                    <span className="font-medium">{(calculation.tileArea * 10000).toFixed(2)} cm²</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={copyResults}>
                    <Copy className="h-4 w-4 mr-2" />
                    {isCopied ? "Copié!" : "Copier"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={downloadResults}>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </Button>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-2">Conseils</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Commandez 5-10% de carreaux supplémentaires pour les réparations futures</li>
                    <li>• Vérifiez que tous les carreaux proviennent du même lot</li>
                    <li>• Prévoyez des outils de coupe pour les découpes nécessaires</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Entrez les dimensions pour calculer le nombre de carreaux nécessaires</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
