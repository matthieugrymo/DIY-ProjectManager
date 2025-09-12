"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, CheckSquare, Package, Clock, Wrench } from "lucide-react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectCard } from "@/components/project-card"
import { BudgetOverview } from "@/components/budget-overview"
import Link from "next/link"
import Image from "next/image"

interface Project {
  id: string
  title: string
  description: string
  progress: number
  status: "planning" | "in-progress" | "completed" | "on-hold"
  dueDate: string
  tasksCompleted: number
  totalTasks: number
  materialsNeeded: number
  image?: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "Kitchen Backsplash Installation",
    description: "Install subway tile backsplash behind kitchen counter",
    progress: 65,
    status: "in-progress",
    dueDate: "2025-09-20",
    tasksCompleted: 4,
    totalTasks: 6,
    materialsNeeded: 3,
    image: "/kitchen-contractor.jpg",
  },
  {
    id: "2",
    title: "Garden Deck Building",
    description: "Build a wooden deck for the backyard garden area",
    progress: 25,
    status: "planning",
    dueDate: "2025-10-15",
    tasksCompleted: 2,
    totalTasks: 8,
    materialsNeeded: 12,
    image: "/construction-site-overview.png",
  },
  {
    id: "3",
    title: "Bathroom Renovation",
    description: "Complete bathroom makeover with new fixtures",
    progress: 100,
    status: "completed",
    dueDate: "2025-08-30",
    tasksCompleted: 10,
    totalTasks: 10,
    materialsNeeded: 0,
    image: "/handyman-fixing-sink.png",
  },
]

export function ProjectDashboard() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [totalBudget, setTotalBudget] = useState(15000)

  const activeProjects = projects.filter((p) => p.status === "in-progress" || p.status === "planning")
  const completedProjects = projects.filter((p) => p.status === "completed")

  const spentAmount = 8750 // Mock spent amount

  const handleBudgetUpdate = (newBudget: number) => {
    setTotalBudget(newBudget)
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image src="/leroy-merlin-logo.svg" alt="Leroy Merlin" width={60} height={36} className="h-9 w-auto" />
          <div>
            <h1 className="text-4xl font-bold text-balance">Smart DIY Planner</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Organize your projects, track materials, and schedule tasks
            </p>
          </div>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          New Project
        </Button>
      </div>

      {/* Budget Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Budget Overview</h2>
        <BudgetOverview
          totalBudget={totalBudget}
          spentAmount={spentAmount}
          projectCount={projects.length}
          onBudgetUpdate={handleBudgetUpdate}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {projects.filter((p) => p.status === "in-progress").length} in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks This Week</CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">8 completed, 4 remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials Needed</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.materialsNeeded, 0)}</div>
            <p className="text-xs text-muted-foreground">Across all projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">Projects finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Active Projects</h2>
          <Link href="/calendar">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Calendar className="h-4 w-4" />
              View Calendar
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest updates from your projects</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Completed "Prepare surface" in Kitchen Backsplash</p>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-accent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Added 5 materials to Garden Deck project</p>
              <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Bathroom Renovation marked as completed</p>
              <p className="text-xs text-muted-foreground">3 days ago</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <CreateProjectDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onProjectCreated={(project) => {
          setProjects([...projects, { ...project, id: Date.now().toString() }])
        }}
      />
    </div>
  )
}
