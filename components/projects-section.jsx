"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { ExternalLink, Github, Star, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ProjectsSection() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedProjects, setLikedProjects] = useState({})
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    async function fetchProjects() {
      try {
        const projectsCollection = collection(db, "projects")
        const projectsSnapshot = await getDocs(projectsCollection)
        const projectsList = projectsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setProjects(projectsList)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])
console.log(projects);

  const handleLikeProject = (id) => {
    setLikedProjects((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px w-12 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold">
                Featured <span className="pink-gradient-text">Projects</span>
              </h2>
              <div className="h-px w-12 bg-primary ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-background rounded-xl overflow-hidden border border-border shadow-sm">
                  <div className="relative h-48 bg-muted animate-pulse"></div>
                  <div className="p-5">
                    <div className="h-6 bg-muted animate-pulse rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-4 bg-muted animate-pulse rounded mb-4 w-1/2"></div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((j) => (
                        <div key={j} className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="projects" className="py-10 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-12 bg-primary mr-4"></div>
            <h2 className="text-3xl font-bold">
              Featured <span className="pink-gradient-text">Projects</span>
            </h2>
            <div className="h-px w-12 bg-primary ml-4"></div>
          </div>

          <motion.div
            ref={ref}
            variants={containerVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {projects.map((project) => (
              <motion.div
                key={project.id}
                variants={itemVariants}
                className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 group hover:border-[#ec489950] hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={project.image || "/placeholder.svg?height=500&width=800"}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {project.featured && (
                    <div className="absolute top-2 left-2 bg-[#ec4899] text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
                      <Star className="h-3 w-3" fill="white" />
                      <span>Featured</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      >
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                          <span>Demo</span>
                        </a>
                      </Button>
                
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90"
                      >
                      
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <Github className="h-4 w-4" />
                          <span>Code</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <button
                      onClick={() => handleLikeProject(project.id)}
                      className="text-foreground/50 hover:text-[#ec4899] transition-colors"
                      aria-label={`Like ${project.title}`}
                    >
                      <Heart
                        className={`h-5 w-5 ${likedProjects[project.id] ? "fill-[#ec4899] text-[#ec4899]" : ""}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags &&
                      project.tags.map((tag, index) => (
                        <span
                          key={tag}
                          className={`px-2 py-1 text-xs rounded-full ${
                            index % 3 === 0
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                              : index % 3 === 1
                                ? "bg-[#ec489915] text-[#ec4899]"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {projects.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-foreground/70">No projects found. Add some projects from your dashboard!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild className="text-white bg-gradient-to-r from-blue-500 to-[#ec4899] hover:opacity-90 bounce-on-hover">
              <a href="https://github.com/hassana123" target="_blank" rel="noopener noreferrer">
                View More On GitHub
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
