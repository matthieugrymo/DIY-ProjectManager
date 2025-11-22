"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string, fallback?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Translation dictionaries
const translations = {
  en: {
    // Navigation & General
    "nav.home": "Home",
    "nav.calendar": "Calendar",
    "nav.projects": "Projects",
    "nav.materials": "Materials",
    "nav.notes": "Notes",
    "nav.budget": "Budget",
    "nav.tasks": "Tasks",

    // Homepage & Dashboard
    "dashboard.title": "DIY Project Manager",
    "dashboard.subtitle": "Manage your home improvement projects with ease",
    "dashboard.viewCalendar": "View Calendar",
    "dashboard.createProject": "Create New Project",
    "dashboard.recentProjects": "Recent Projects",
    "dashboard.quickStats": "Quick Stats",
    "dashboard.totalProjects": "Total Projects",
    "dashboard.activeProjects": "Active Projects",
    "dashboard.completedProjects": "Completed Projects",
    "dashboard.totalBudget": "Total Budget",
    "dashboard.recentActivity": "Recent Activity",
    "dashboard.progressOverview": "Progress Overview",
    "dashboard.timeSpent": "Time Spent",
    "dashboard.deadline": "Deadline",
    "dashboard.thisWeek": "This Week",
    "dashboard.remaining": "remaining",
    "dashboard.completed": "completed",
    "dashboard.needed": "needed",
    "dashboard.acrossProjects": "across all projects",

    // Project Status
    "status.planning": "Planning",
    "status.inProgress": "In Progress",
    "status.completed": "Completed",
    "status.onHold": "On Hold",

    // Project Actions
    "project.share": "Share Project",
    "project.requestHelp": "Request Help",
    "project.edit": "Edit Project",
    "project.delete": "Delete Project",
    "project.viewDetails": "View Details",
    "project.tileConfigurator": "Tile Configurator",

    // Materials
    "materials.title": "Materials",
    "materials.addMaterial": "Add Material",
    "materials.createWishlist": "Create Wishlist",
    "materials.totalCost": "Total Cost",
    "materials.purchased": "Purchased",
    "materials.pending": "Pending",
    "materials.quantity": "Quantity",
    "materials.unitPrice": "Unit Price",
    "materials.supplier": "Supplier",

    // Budget
    "budget.overview": "Budget Overview",
    "budget.totalBudget": "Total Budget",
    "budget.spent": "Spent",
    "budget.remaining": "Remaining",
    "budget.setBudget": "Set Budget",
    "budget.updateBudget": "Update Budget",

    // Tasks
    "tasks.title": "Tasks",
    "tasks.addTask": "Add Task",
    "tasks.completed": "Completed",
    "tasks.pending": "Pending",
    "tasks.dueDate": "Due Date",
    "tasks.priority": "Priority",
    "tasks.assignedTo": "Assigned To",

    // Notes
    "notes.title": "Notes",
    "notes.addNote": "Add Note",
    "notes.editNote": "Edit Note",
    "notes.deleteNote": "Delete Note",
    "notes.category.general": "General",
    "notes.category.important": "Important",
    "notes.category.reminder": "Reminder",
    "notes.category.idea": "Idea",

    // Calendar
    "calendar.title": "Project Calendar",
    "calendar.allProjects": "All Projects",
    "calendar.upcomingTasks": "Upcoming Tasks",
    "calendar.today": "Today",
    "calendar.nextWeek": "Next Week",

    // Forms & Buttons
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.delete": "Delete",
    "button.edit": "Edit",
    "button.add": "Add",
    "button.update": "Update",
    "button.close": "Close",
    "button.confirm": "Confirm",

    // Common
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.name": "Name",
    "common.description": "Description",
    "common.date": "Date",
    "common.price": "Price",
    "common.total": "Total",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.progress": "Progress",
  },
  fr: {
    // Navigation & General
    "nav.home": "Accueil",
    "nav.calendar": "Calendrier",
    "nav.projects": "Projets",
    "nav.materials": "Matériaux",
    "nav.notes": "Notes",
    "nav.budget": "Budget",
    "nav.tasks": "Tâches",

    // Homepage & Dashboard
    "dashboard.title": "Gestionnaire de Projets Bricolage",
    "dashboard.subtitle": "Gérez vos projets d'amélioration de l'habitat en toute simplicité",
    "dashboard.viewCalendar": "Voir le Calendrier",
    "dashboard.createProject": "Créer un Nouveau Projet",
    "dashboard.recentProjects": "Projets Récents",
    "dashboard.quickStats": "Statistiques Rapides",
    "dashboard.totalProjects": "Total des Projets",
    "dashboard.activeProjects": "Projets Actifs",
    "dashboard.completedProjects": "Projets Terminés",
    "dashboard.totalBudget": "Budget Total",
    "dashboard.recentActivity": "Activité Récente",
    "dashboard.progressOverview": "Aperçu du Progrès",
    "dashboard.timeSpent": "Temps Passé",
    "dashboard.deadline": "Date Limite",
    "dashboard.thisWeek": "Cette Semaine",
    "dashboard.remaining": "restantes",
    "dashboard.completed": "terminées",
    "dashboard.needed": "nécessaires",
    "dashboard.acrossProjects": "dans tous les projets",

    // Project Status
    "status.planning": "Planification",
    "status.inProgress": "En Cours",
    "status.completed": "Terminé",
    "status.onHold": "En Attente",

    // Project Actions
    "project.share": "Partager le Projet",
    "project.requestHelp": "Demander de l'Aide",
    "project.edit": "Modifier le Projet",
    "project.delete": "Supprimer le Projet",
    "project.viewDetails": "Voir les Détails",
    "project.tileConfigurator": "Configurateur de Carreaux",

    // Materials
    "materials.title": "Matériaux",
    "materials.addMaterial": "Ajouter un Matériau",
    "materials.createWishlist": "Créer une Liste de Souhaits",
    "materials.totalCost": "Coût Total",
    "materials.purchased": "Acheté",
    "materials.pending": "En Attente",
    "materials.quantity": "Quantité",
    "materials.unitPrice": "Prix Unitaire",
    "materials.supplier": "Fournisseur",

    // Budget
    "budget.overview": "Aperçu du Budget",
    "budget.totalBudget": "Budget Total",
    "budget.spent": "Dépensé",
    "budget.remaining": "Restant",
    "budget.setBudget": "Définir le Budget",
    "budget.updateBudget": "Mettre à Jour le Budget",

    // Tasks
    "tasks.title": "Tâches",
    "tasks.addTask": "Ajouter une Tâche",
    "tasks.completed": "Terminé",
    "tasks.pending": "En Attente",
    "tasks.dueDate": "Date d'Échéance",
    "tasks.priority": "Priorité",
    "tasks.assignedTo": "Assigné à",

    // Notes
    "notes.title": "Notes",
    "notes.addNote": "Ajouter une Note",
    "notes.editNote": "Modifier la Note",
    "notes.deleteNote": "Supprimer la Note",
    "notes.category.general": "Général",
    "notes.category.important": "Important",
    "notes.category.reminder": "Rappel",
    "notes.category.idea": "Idée",

    // Calendar
    "calendar.title": "Calendrier des Projets",
    "calendar.allProjects": "Tous les Projets",
    "calendar.upcomingTasks": "Tâches à Venir",
    "calendar.today": "Aujourd'hui",
    "calendar.nextWeek": "Semaine Prochaine",

    // Forms & Buttons
    "button.save": "Enregistrer",
    "button.cancel": "Annuler",
    "button.delete": "Supprimer",
    "button.edit": "Modifier",
    "button.add": "Ajouter",
    "button.update": "Mettre à Jour",
    "button.close": "Fermer",
    "button.confirm": "Confirmer",

    // Common
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.name": "Nom",
    "common.description": "Description",
    "common.date": "Date",
    "common.price": "Prix",
    "common.total": "Total",
    "common.search": "Rechercher",
    "common.filter": "Filtrer",
    "common.progress": "Progrès",
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language)
  }, [language])

  const t = (key: string, fallback?: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || fallback || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
