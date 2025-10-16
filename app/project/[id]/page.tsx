"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  ArrowLeft,
  Plus,
  Calendar,
  CheckSquare,
  Package,
  Calculator,
  FileText,
  Share2,
  Check,
  Menu,
} from "lucide-react"
import { TaskList } from "@/components/task-list"
import { MaterialList } from "@/components/material-list"
import { ProjectCalendar } from "@/components/project-calendar"
import { ProjectBudget } from "@/components/project-budget"
import { ProjectFiles } from "@/components/project-files"
import { ProjectNotes } from "@/components/project-notes"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { useIsMobile } from "@/components/ui/use-mobile"

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

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  estimatedHours?: number
  dependencies?: string[]
}

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

// Mock data - in a real app this would come from a database
const mockProject: Project = {
  id: "1",
  title: "Kitchen Backsplash Installation",
  description: "Install subway tile backsplash behind kitchen counter with proper waterproofing and grouting",
  progress: 65,
  status: "in-progress",
  dueDate: "2025-09-20",
  tasksCompleted: 4,
  totalTasks: 6,
  materialsNeeded: 3,
  image: "/kitchen-backsplash-installation.jpg",
}

const mockTasks: Task[] = [
  {
    id: "1",
    title: "Measure wall dimensions",
    description: "Accurately measure the wall area for tile calculation",
    completed: true,
    priority: "high",
    estimatedHours: 1,
  },
  {
    id: "2",
    title: "Purchase materials",
    description: "Buy tiles, adhesive, grout, and tools",
    completed: true,
    priority: "high",
    estimatedHours: 2,
  },
  {
    id: "3",
    title: "Prepare wall surface",
    description: "Clean wall, apply primer if needed",
    completed: true,
    priority: "medium",
    estimatedHours: 3,
  },
  {
    id: "4",
    title: "Install tile spacers and layout",
    description: "Mark guidelines and install first row of tiles",
    completed: true,
    priority: "high",
    dueDate: "2025-09-15",
    estimatedHours: 4,
  },
  {
    id: "5",
    title: "Install remaining tiles",
    description: "Complete tile installation following the layout",
    completed: false,
    priority: "high",
    dueDate: "2025-09-18",
    estimatedHours: 6,
    dependencies: ["4"],
  },
  {
    id: "6",
    title: "Apply grout and clean",
    description: "Grout tiles and clean excess, apply sealant",
    completed: false,
    priority: "medium",
    dueDate: "2025-09-20",
    estimatedHours: 4,
    dependencies: ["5"],
  },
]

const mockMaterials: Material[] = [
  {
    id: "1",
    name: "Subway Tiles (3x6 inch)",
    quantity: 50,
    unit: "pieces",
    cost: 2.5,
    purchased: true,
    supplier: "Home Depot",
  },
  {
    id: "2",
    name: "Tile Adhesive",
    quantity: 2,
    unit: "bags",
    cost: 15.99,
    purchased: true,
    supplier: "Home Depot",
  },
  {
    id: "3",
    name: "Grout (White)",
    quantity: 1,
    unit: "bag",
    cost: 12.99,
    purchased: false,
    supplier: "Lowes",
    notes: "Need sanded grout for 1/8 inch gaps",
  },
  {
    id: "4",
    name: "Tile Spacers (1/8 inch)",
    quantity: 100,
    unit: "pieces",
    cost: 8.99,
    purchased: true,
  },
  {
    id: "5",
    name: "Grout Sealer",
    quantity: 1,
    unit: "bottle",
    cost: 18.99,
    purchased: false,
    notes: "Apply 24 hours after grouting",
  },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<Project>(mockProject)
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [isShared, setIsShared] = useState(false)
  const [activeTab, setActiveTab] = useState("tasks")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const { t } = useLanguage()

  const handleAddTask = (newTask: Omit<Task, "id">) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(), // Simple ID generation for demo
    }
    setTasks((prevTasks) => [...prevTasks, task])
  }

  const handleShare = async () => {
    const projectUrl = `${window.location.origin}/project/${params.id}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: project.title,
          text: `Check out my DIY project: ${project.title}`,
          url: projectUrl,
        })
        return
      } catch (error) {}
    }

    try {
      await navigator.clipboard.writeText(projectUrl)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    } catch (error) {
      const textArea = document.createElement("textarea")
      textArea.value = projectUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setIsShared(true)
      setTimeout(() => setIsShared(false), 2000)
    }
  }

  const handleRequestHelp = () => {
    router.push(`/project/${params.id}/request-help`)
  }

  const handleTileConfigurator = () => {
    router.push(`/project/${params.id}/tile-configurator`)
  }

  const isTileProject = () => {
    const tileKeywords = ["tile", "backsplash", "subway", "ceramic", "porcelain", "mosaic"]
    return tileKeywords.some(
      (keyword) => project.title.toLowerCase().includes(keyword) || project.description.toLowerCase().includes(keyword),
    )
  }

  const completedTasks = tasks.filter((task) => task.completed).length
  const totalEstimatedHours = tasks.reduce((acc, task) => acc + (task.estimatedHours || 0), 0)
  const completedHours = tasks
    .filter((task) => task.completed)
    .reduce((acc, task) => acc + (task.estimatedHours || 0), 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
  }

  const tabs = [
    { value: "tasks", label: t("nav.tasks"), icon: CheckSquare },
    { value: "materials", label: t("nav.materials"), icon: Package },
    { value: "budget", label: t("nav.budget"), icon: Calculator },
    { value: "files", label: "Fichiers", icon: FileText },
    { value: "notes", label: t("nav.notes"), icon: FileText },
    { value: "calendar", label: t("nav.calendar"), icon: Calendar },
  ]

  return (
    <div className="container mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 px-2 sm:px-4">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm">Retour</span>
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          className="gap-1 sm:gap-2 bg-transparent px-2 sm:px-4"
          onClick={handleShare}
        >
          {isShared ? (
            <>
              <Check className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">Copié!</span>
            </>
          ) : (
            <>
              <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{t("project.share")}</span>
            </>
          )}
        </Button>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 text-sm sm:text-base">{project.description}</CardDescription>
                </div>
                <Badge
                  className={
                    project.status === "in-progress" ? "bg-yellow-100 text-yellow-800 flex-shrink-0" : "flex-shrink-0"
                  }
                >
                  <span className="text-xs">{t(`status.${project.status.replace("-", "")}`)}</span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {project.image && (
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-32 sm:h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-primary">{completedTasks}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Tâches Terminées</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">{tasks.length}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Total Tâches</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-accent">{completedHours}h</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Heures Passées</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold">{formatDate(project.dueDate)}</div>
                  <div className="text-[10px] sm:text-sm text-muted-foreground">Date Limite</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Aperçu du Progrès</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Progrès Global</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2 sm:h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Tâches Terminées</span>
                  <span className="font-medium">
                    {completedTasks}/{tasks.length}
                  </span>
                </div>
                <Progress value={(completedTasks / tasks.length) * 100} className="h-1.5 sm:h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span>Progrès Temps</span>
                  <span className="font-medium">
                    {completedHours}/{totalEstimatedHours}h
                  </span>
                </div>
                <Progress value={(completedHours / totalEstimatedHours) * 100} className="h-1.5 sm:h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 sm:space-y-2">
              <Button className="w-full gap-2 text-xs sm:text-sm h-8 sm:h-9" size="sm">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("tasks.addTask")}
              </Button>
              <Button className="w-full gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9" variant="outline" size="sm">
                <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("materials.addMaterial")}
              </Button>
              {isTileProject() && (
                <Button
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                  size="sm"
                  onClick={handleTileConfigurator}
                >
                  <Calculator className="h-3 w-3 sm:h-4 sm:w-4" />
                  {t("project.tileConfigurator", "Configurateur de Carreaux")}
                </Button>
              )}
              <Button className="w-full gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9" variant="outline" size="sm">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                Planifier Tâche
              </Button>
              <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm h-8 sm:h-9"
                size="sm"
                onClick={handleRequestHelp}
              >
                <svg className="h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                  />
                </svg>
                {t("project.requestHelp")}
              </Button>
              <Button
                className="w-full gap-2 bg-transparent text-xs sm:text-sm h-8 sm:h-9"
                variant="outline"
                size="sm"
                onClick={handleShare}
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                {t("project.share")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for different views */}
      {isMobile ? (
        <div className="space-y-4">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full gap-2 bg-transparent">
                <Menu className="h-4 w-4" />
                {tabs.find((tab) => tab.value === activeTab)?.label || "Menu"}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <div className="space-y-2 py-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <Button
                      key={tab.value}
                      variant={activeTab === tab.value ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => {
                        setActiveTab(tab.value)
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {tab.label}
                    </Button>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>

          <div>
            {activeTab === "tasks" && <TaskList tasks={tasks} onTasksChange={setTasks} />}
            {activeTab === "materials" && <MaterialList materials={materials} onMaterialsChange={setMaterials} />}
            {activeTab === "budget" && <ProjectBudget projectId={project.id} />}
            {activeTab === "files" && <ProjectFiles projectId={project.id} />}
            {activeTab === "notes" && <ProjectNotes projectId={project.id} />}
            {activeTab === "calendar" && <ProjectCalendar tasks={tasks} onAddTask={handleAddTask} />}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>

          <TabsContent value="tasks">
            <TaskList tasks={tasks} onTasksChange={setTasks} />
          </TabsContent>

          <TabsContent value="materials">
            <MaterialList materials={materials} onMaterialsChange={setMaterials} />
          </TabsContent>

          <TabsContent value="budget">
            <ProjectBudget projectId={project.id} />
          </TabsContent>

          <TabsContent value="files">
            <ProjectFiles projectId={project.id} />
          </TabsContent>

          <TabsContent value="notes">
            <ProjectNotes projectId={project.id} />
          </TabsContent>

          <TabsContent value="calendar">
            <ProjectCalendar tasks={tasks} onAddTask={handleAddTask} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
