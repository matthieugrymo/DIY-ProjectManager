"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, TrendingUp, AlertTriangle, Settings } from "lucide-react"

interface BudgetOverviewProps {
  totalBudget: number
  spentAmount: number
  projectCount: number
  onBudgetUpdate?: (newBudget: number) => void
}

export function BudgetOverview({ totalBudget, spentAmount, projectCount, onBudgetUpdate }: BudgetOverviewProps) {
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [newBudgetAmount, setNewBudgetAmount] = useState(totalBudget.toString())

  const remainingBudget = totalBudget - spentAmount
  const spentPercentage = (spentAmount / totalBudget) * 100
  const averagePerProject = projectCount > 0 ? totalBudget / projectCount : 0

  const handleBudgetUpdate = () => {
    const amount = Number.parseFloat(newBudgetAmount)
    if (!isNaN(amount) && amount > 0) {
      onBudgetUpdate?.(amount)
      setIsEditingBudget(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <Dialog open={isEditingBudget} onOpenChange={setIsEditingBudget}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Set Total Budget</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Budget Amount</label>
                    <Input
                      type="number"
                      value={newBudgetAmount}
                      onChange={(e) => setNewBudgetAmount(e.target.value)}
                      placeholder="Enter total budget"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsEditingBudget(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleBudgetUpdate}>Update Budget</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Across {projectCount} projects</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Spent</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${spentAmount.toLocaleString()}</div>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={spentPercentage} className="flex-1 h-2" />
            <span className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}%</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Remaining</CardTitle>
          <AlertTriangle
            className={`h-4 w-4 ${remainingBudget < totalBudget * 0.2 ? "text-red-500" : "text-muted-foreground"}`}
          />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${remainingBudget.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">${averagePerProject.toFixed(0)} avg per project</p>
        </CardContent>
      </Card>
    </div>
  )
}
