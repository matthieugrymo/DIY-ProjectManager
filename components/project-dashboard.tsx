"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, CheckSquare, Package, Clock, Wrench } from "lucide-react"
import { CreateProjectDialog } from "@/components/create-project-dialog"
import { ProjectCard } from "@/components/project-card"
import { BudgetOverview } from "@/components/budget-overview"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
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
  const { t } = useLanguage()

  const activeProjects = projects.filter((p) => p.status === "in-progress" || p.status === "planning")
  const completedProjects = projects.filter((p) => p.status === "completed")

  const spentAmount = 8750

  const handleBudgetUpdate = (newBudget: number) => {
    setTotalBudget(newBudget)
  }

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Image src="/leroy-merlin-logo.svg" alt="Leroy Merlin" width={50} height={30} className="h-7 sm:h-9 w-auto" />
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-balance">{t("dashboard.title")}</h1>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mt-1 sm:mt-2">
              {t("dashboard.subtitle")}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <LanguageSelector />
          <Button onClick={() => setShowCreateDialog(true)} size="default" className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">{t("dashboard.createProject")}</span>
          </Button>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="space-y-3 sm:space-y-4">
        <h2 className="text-xl sm:text-2xl font-semibold">{t("budget.overview")}</h2>
        <BudgetOverview
          totalBudget={totalBudget}
          spentAmount={spentAmount}
          projectCount={projects.length}
          onBudgetUpdate={handleBudgetUpdate}
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.activeProjects")}</CardTitle>
            <Wrench className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {projects.filter((p) => p.status === "in-progress").length} {t("status.inProgress").toLowerCase()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t("tasks.title")} Cette Semaine</CardTitle>
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">12</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              8 {t("tasks.completed").toLowerCase()}, 4 restantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t("materials.title")} Nécessaires</CardTitle>
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {projects.reduce((acc, p) => acc + p.materialsNeeded, 0)}
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Dans tous les projets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">{t("dashboard.completedProjects")}</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-[10px] sm:text-xs text-muted-foreground">Projets terminés</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-semibold">{t("dashboard.activeProjects")}</h2>
          <Link href="/calendar">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent w-full sm:w-auto">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{t("dashboard.viewCalendar")}</span>
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {activeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">Activité Récente</CardTitle>
          <CardDescription className="text-sm">Dernières mises à jour de vos projets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm">Terminé "Préparer la surface" dans Carrelage de Cuisine</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Il y a 2 heures</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm">Ajouté 5 matériaux au projet Terrasse de Jardin</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Il y a 1 jour</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-2 h-2 bg-chart-3 rounded-full flex-shrink-0"></div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm">Rénovation de Salle de Bain marquée comme terminée</p>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Il y a 3 jours</p>
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
