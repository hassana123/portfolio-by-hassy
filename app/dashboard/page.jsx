"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ChevronRight, Database, Edit3, Eye, User, Settings, MessageSquare, FolderIcon, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    messages: 0,
  })
  const [recentProjects, setRecentProjects] = useState([])
  const [recentMessages, setRecentMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch projects count
        const projectsSnapshot = await getDocs(collection(db, "projects"))
        const projectsCount = projectsSnapshot.size

        // Fetch skills count
        const skillsSnapshot = await getDocs(collection(db, "skills"))
        const skillsCount = skillsSnapshot.size

        // Fetch messages count
        const messagesSnapshot = await getDocs(collection(db, "messages"))
        const messagesCount = messagesSnapshot.size

        setStats({
          projects: projectsCount,
          skills: skillsCount,
          messages: messagesCount,
        })

        // Fetch recent projects
        const recentProjectsQuery = query(collection(db, "projects"), orderBy("createdAt", "desc"), limit(3))
        const recentProjectsSnapshot = await getDocs(recentProjectsQuery)
        const recentProjectsList = recentProjectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || new Date(),
        }))
        setRecentProjects(recentProjectsList)

        // Fetch recent messages
        const recentMessagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(3))
        const recentMessagesSnapshot = await getDocs(recentMessagesQuery)
        const recentMessagesList = recentMessagesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          date: doc.data().createdAt?.toDate() || new Date(),
        }))
        setRecentMessages(recentMessagesList)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to format date
  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date

    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) {
      return `${days} day${days > 1 ? "s" : ""} ago`
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`
    } else if (minutes > 0) {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    } else {
      return "Just now"
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-foreground/70">Welcome back, {user?.displayName || user?.email || "Admin"}!</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button asChild variant="outline" size="sm">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              View Site
            </a>
          </Button>
          <Button asChild size="sm" className="bg-pink-500 hover:bg-pink-600">
            <a href="/dashboard/profile" className="flex items-center gap-1">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </a>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            <p className="mt-2 text-foreground/70">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Total Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full">
                    <Database className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold">{stats.projects}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">Total Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-full">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold">{stats.skills}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-foreground/70">New Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <div className="mr-4 p-2 bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-full">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="text-3xl font-bold">{stats.messages}</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Projects</CardTitle>
                <CardDescription>Your recently added or updated projects.</CardDescription>
              </CardHeader>
              <CardContent>
                {recentProjects.length > 0 ? (
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <FolderIcon className="h-5 w-5 text-foreground/70" />
                          </div>
                          <div>
                            <div className="font-medium">{project.title}</div>
                            <div className="text-xs text-foreground/60">Updated {formatDate(project.date)}</div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/dashboard/projects?edit=${project.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-foreground/70">No projects yet. Add your first project!</p>
                    <Button asChild className="mt-4 bg-pink-500 hover:bg-pink-600">
                      <a href="/dashboard/projects">Add Project</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>Messages from visitors via your contact form.</CardDescription>
              </CardHeader>
              <CardContent>
                {recentMessages.length > 0 ? (
                  <div className="space-y-4">
                    {recentMessages.map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-5 w-5 text-foreground/70" />
                          </div>
                          <div>
                            <div className="font-medium">{message.name}</div>
                            <div className="text-xs text-foreground/60">
                              {message.subject} • {formatDate(message.date)}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={`/dashboard/messages?id=${message.id}`}>
                            <ChevronRight className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-foreground/70">No messages yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
