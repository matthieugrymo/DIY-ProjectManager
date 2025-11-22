"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, Package, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context" // Added import

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

interface ProjectCardProps {
  project: Project
}

const statusColors = {
  planning: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  "in-progress": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  "on-hold": "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { t } = useLanguage() // Added hook usage

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video overflow-hidden max-h-[180px] sm:max-h-[200px]">
        <img
          src={project.image || "/placeholder.svg?height=200&width=300&query=DIY project workspace"}
          alt={project.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 pt-3 sm:pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg leading-tight">{project.title}</CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{project.description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0">
                <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t("project.viewDetails")}</DropdownMenuItem> {/* Used translation */}
              <DropdownMenuItem>{t("project.edit")}</DropdownMenuItem> {/* Used translation */}
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">{t("project.delete")}</DropdownMenuItem>{" "}
              {/* Used translation */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
        <div className="flex items-center justify-between">
          <Badge className={`${statusColors[project.status]} text-[10px] sm:text-xs`}>
            {t(`status.${project.status.replace("-", "")}` as any)} {/* Used translation */}
          </Badge>
          <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {formatDate(project.dueDate)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span>{t("common.progress")}</span> {/* Used translation */}
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5 sm:h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span>
              {project.tasksCompleted}/{project.totalTasks} {t("nav.tasks").toLowerCase()} {/* Used translation */}
            </span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span>
              {project.materialsNeeded} {t("nav.materials").toLowerCase()}
            </span>{" "}
            {/* Used translation */}
          </div>
        </div>

        <Link href={`/project/${project.id}`}>
          <Button className="w-full bg-transparent text-xs sm:text-sm h-8 sm:h-9" variant="outline">
            {t("project.viewDetails")} {/* Used translation */}
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
