"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Calendar, CheckSquare, Package, Calculator, FileText, Share2, Check } from "lucide-react"
import { TaskList } from "@/components/task-list"
import { MaterialList } from "@/components/material-list"
import { ProjectCalendar } from "@/components/project-calendar"
import { ProjectBudget } from "@/components/project-budget"
import { ProjectFiles } from "@/components/project-files"
import { ProjectNotes } from "@/components/project-notes"
import Link from "next/link"

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

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleShare}>
          {isShared ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4" />
              Share Project
            </>
          )}
        </Button>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{project.title}</CardTitle>
                  <CardDescription className="mt-2 text-base">{project.description}</CardDescription>
                </div>
                <Badge className={project.status === "in-progress" ? "bg-yellow-100 text-yellow-800" : ""}>
                  {project.status.replace("-", " ")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {project.image && (
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{completedTasks}</div>
                  <div className="text-sm text-muted-foreground">Tasks Done</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{tasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{completedHours}h</div>
                  <div className="text-sm text-muted-foreground">Hours Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{formatDate(project.dueDate)}</div>
                  <div className="text-sm text-muted-foreground">Due Date</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-3" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tasks Completed</span>
                  <span className="font-medium">
                    {completedTasks}/{tasks.length}
                  </span>
                </div>
                <Progress value={(completedTasks / tasks.length) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Time Progress</span>
                  <span className="font-medium">
                    {completedHours}/{totalEstimatedHours}h
                  </span>
                </div>
                <Progress value={(completedHours / totalEstimatedHours) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full gap-2" size="sm">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
              <Button className="w-full gap-2 bg-transparent" variant="outline" size="sm">
                <Package className="h-4 w-4" />
                Add Material
              </Button>
              <Button className="w-full gap-2 bg-transparent" variant="outline" size="sm">
                <Calendar className="h-4 w-4" />
                Schedule Task
              </Button>
              <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                size="sm"
                onClick={handleRequestHelp}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h8z"
                  />
                </svg>
                Request Help
              </Button>
              <Button className="w-full gap-2 bg-transparent" variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Share Project
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="tasks" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tasks" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="materials" className="gap-2">
            <Package className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="budget" className="gap-2">
            <Calculator className="h-4 w-4" />
            Budget
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FileText className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="notes" className="gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Notes
          </TabsTrigger>
          <TabsTrigger value="calendar" className="gap-2">
            <Calendar className="h-4 w-4" />
            Calendar
          </TabsTrigger>
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
    </div>
  )
}
