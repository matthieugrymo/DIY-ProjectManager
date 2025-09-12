"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ChevronLeft, ChevronRight, Clock, ArrowLeft, Filter } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: "low" | "medium" | "high"
  dueDate?: string
  estimatedHours?: number
  projectId: string
  projectName: string
  projectColor: string
}

interface Project {
  id: string
  name: string
  color: string
  status: "planning" | "in-progress" | "completed" | "on-hold"
}

// Mock data for all projects and their tasks
const mockProjects: Project[] = [
  { id: "1", name: "Kitchen Backsplash", color: "bg-emerald-500", status: "in-progress" },
  { id: "2", name: "Garden Deck", color: "bg-blue-500", status: "planning" },
  { id: "3", name: "Bathroom Renovation", color: "bg-purple-500", status: "completed" },
]

const mockAllTasks: Task[] = [
  {
    id: "1",
    title: "Install subway tiles",
    description: "Install the subway tiles on the kitchen wall",
    completed: false,
    priority: "high",
    dueDate: "2025-09-15",
    estimatedHours: 4,
    projectId: "1",
    projectName: "Kitchen Backsplash",
    projectColor: "bg-emerald-500",
  },
  {
    id: "2",
    title: "Apply grout",
    description: "Apply grout between tiles and clean excess",
    completed: false,
    priority: "medium",
    dueDate: "2025-09-16",
    estimatedHours: 2,
    projectId: "1",
    projectName: "Kitchen Backsplash",
    projectColor: "bg-emerald-500",
  },
  {
    id: "3",
    title: "Purchase lumber",
    description: "Buy pressure-treated lumber for deck frame",
    completed: false,
    priority: "high",
    dueDate: "2025-09-18",
    estimatedHours: 1,
    projectId: "2",
    projectName: "Garden Deck",
    projectColor: "bg-blue-500",
  },
  {
    id: "4",
    title: "Build deck frame",
    description: "Construct the wooden frame for the deck",
    completed: false,
    priority: "high",
    dueDate: "2025-09-20",
    estimatedHours: 6,
    projectId: "2",
    projectName: "Garden Deck",
    projectColor: "bg-blue-500",
  },
  {
    id: "5",
    title: "Install decking boards",
    description: "Install and secure the deck boards",
    completed: false,
    priority: "medium",
    dueDate: "2025-09-22",
    estimatedHours: 4,
    projectId: "2",
    projectName: "Garden Deck",
    projectColor: "bg-blue-500",
  },
  {
    id: "6",
    title: "Final inspection",
    description: "Complete final inspection and cleanup",
    completed: true,
    priority: "low",
    dueDate: "2025-09-12",
    estimatedHours: 1,
    projectId: "3",
    projectName: "Bathroom Renovation",
    projectColor: "bg-purple-500",
  },
]

export default function CombinedCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [tasks] = useState<Task[]>(mockAllTasks)
  const router = useRouter()

  const navigateToProject = (projectId: string) => {
    router.push(`/project/${projectId}`)
  }

  const filteredTasks = selectedProject === "all" ? tasks : tasks.filter((task) => task.projectId === selectedProject)

  const tasksWithDates = filteredTasks.filter((task) => task.dueDate)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getTasksForDate = (dateString: string) => {
    return tasksWithDates.filter((task) => task.dueDate === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDayOfMonth = getFirstDayOfMonth(currentDate)
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  const priorityColors = {
    low: "bg-blue-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  }

  const getUpcomingTasks = () => {
    const today = new Date()
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

    return tasksWithDates
      .filter((task) => {
        if (!task.dueDate) return false
        const taskDate = new Date(task.dueDate)
        return taskDate >= today && taskDate <= nextWeek && !task.completed
      })
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-balance">Project Calendar</h1>
            <p className="text-muted-foreground text-lg mt-1">View all project tasks and schedules in one place</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {mockProjects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                      {project.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{monthName}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Combined Project Schedule
              </CardTitle>
              <CardDescription>
                {selectedProject === "all"
                  ? "All tasks from all projects"
                  : `Tasks from ${mockProjects.find((p) => p.id === selectedProject)?.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }, (_, i) => (
                  <div key={`empty-${i}`} className="p-2 h-28"></div>
                ))}

                {Array.from({ length: daysInMonth }, (_, i) => {
                  const day = i + 1
                  const dateString = formatDate(currentDate.getFullYear(), currentDate.getMonth(), day)
                  const dayTasks = getTasksForDate(dateString)
                  const isToday = dateString === new Date().toISOString().split("T")[0]

                  return (
                    <div
                      key={day}
                      className={`p-2 h-28 border rounded-lg transition-all duration-200 ${
                        isToday ? "bg-primary/10 border-primary" : "border-border"
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${isToday ? "text-primary" : ""}`}>{day}</div>
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div
                            key={task.id}
                            onClick={() => navigateToProject(task.projectId)}
                            className={`text-xs p-1 rounded text-white truncate cursor-pointer hover:opacity-80 transition-opacity ${
                              task.projectColor
                            } ${task.completed ? "opacity-50 line-through" : ""}`}
                            title={`${task.projectName}: ${task.title} - Click to open project`}
                          >
                            <div className="flex items-center gap-1">
                              <div className={`w-1 h-1 rounded-full ${priorityColors[task.priority]}`}></div>
                              <span className="truncate">{task.title}</span>
                            </div>
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
              <CardDescription>Next 7 days</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUpcomingTasks()
                .slice(0, 8)
                .map((task) => (
                  <div
                    key={task.id}
                    onClick={() => navigateToProject(task.projectId)}
                    className="space-y-2 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></div>
                      <span className="text-sm font-medium truncate">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {task.projectName}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate!).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                      {task.estimatedHours && (
                        <>
                          <Clock className="h-3 w-3 ml-2" />
                          {task.estimatedHours}h
                        </>
                      )}
                    </div>
                  </div>
                ))}

              {getUpcomingTasks().length === 0 && <p className="text-sm text-muted-foreground">No upcoming tasks</p>}
            </CardContent>
          </Card>

          {/* Project Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {mockProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => navigateToProject(project.id)}
                  className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${project.color}`}></div>
                  <span>{project.name}</span>
                  <Badge variant="outline" className="text-xs ml-auto">
                    {project.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Priority Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Priority</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-red-500"></div>
                <span>High Priority</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-yellow-500"></div>
                <span>Medium Priority</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded bg-blue-500"></div>
                <span>Low Priority</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
