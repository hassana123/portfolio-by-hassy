"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle, Search, MoreVertical, Eye, Edit, Trash, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"


export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    demoUrl: "",
    repoUrl: "",
    featured: false,
    image: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()



  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const projectsCollection = collection(db, "projects")
      const projectsSnapshot = await getDocs(projectsCollection)
      const projectsList = projectsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setProjects(projectsList)
    } catch (error) {
      console.error("Error fetching projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(
    (project) =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags?.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleOpenDialog = (project = null) => {
    console.log("Opening dialog for project:", project);
    setIsDialogOpen(true)
    if (project) {
      setCurrentProject(project)
      setFormData({
        title: project.title || "",
        description: project.description || "",
        tags: project.tags?.join(", ") || "",
        demoUrl: project.demoUrl || "",
        repoUrl: project.repoUrl || "",
        featured: project.featured || false,
        image: null,
      })
    } else {
      setCurrentProject(null)
      setFormData({
        title: "",
        description: "",
        tags: "",
        demoUrl: "",
        repoUrl: "",
        featured: false,
        image: null,
      })
    }
   
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    console.log("Selected file:", file);
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = currentProject?.image || null

      // Upload image if a new one is selected
      if (formData.image) {
        console.log(formData.image);
        const imageName = formData.image.name ?? `image-${Date.now()}`; // fallback if name is undefined
        const storageRef = ref(storage, `projects/${imageName}-${Date.now()}`);
        await uploadBytes(storageRef, formData.image);
        imageUrl = await getDownloadURL(storageRef);
      }

      const projectData = {
        title: formData.title,
        description: formData.description,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
        demoUrl: formData.demoUrl,
        repoUrl: formData.repoUrl,
        featured: formData.featured,
        updatedAt: serverTimestamp(),
      }
console.log(projectData);

      if (imageUrl) {
        projectData.image = imageUrl
      }

      if (currentProject) {
        // Update existing project
        await updateDoc(doc(db, "projects", currentProject.id), projectData)
        toast({
          title: "Project updated",
          description: "The project has been updated successfully.",
        })
      } else {
        // Add new project
        projectData.createdAt = serverTimestamp()
        await addDoc(collection(db, "projects"), projectData)
        toast({
          title: "Project added",
          description: "The new project has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      fetchProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentProject) return

    try {
      setIsSubmitting(true)
      await deleteDoc(doc(db, "projects", currentProject.id))
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFeatured = async (project) => {
    try {
      await updateDoc(doc(db, "projects", project.id), {
        featured: !project.featured,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: project.featured ? "Project unfeatured" : "Project featured",
        description: `The project "${project.title}" has been ${project.featured ? "removed from" : "added to"} featured projects.`,
      })

      fetchProjects()
    } catch (error) {
      console.error("Error updating project:", error)
      toast({
        title: "Error",
        description: "Failed to update project. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (project) => {
    setCurrentProject(project)
    setIsDeleteDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <p className="mt-2 text-foreground/70">Loading projects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-foreground/70">Manage your portfolio projects</p>
        </div>
        <Button className="mt-4 sm:mt-0 text-white bg-pink-500 hover:bg-pink-600" onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Project
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={project.image || "/placeholder.svg?height=500&width=800"}
                alt={project.title}
                fill
                className="object-cover"
              />
              {project.featured && (
                <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-1 truncate">{project.title}</h3>
                  <p className="text-foreground/70 text-sm mb-2 line-clamp-2">{project.description}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-white px-2 py-2" align="end">
                    <DropdownMenuItem className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Preview</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center" onClick={() => handleOpenDialog(project)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center" onClick={() => handleToggleFeatured(project)}>
                      <Star fill={project.featured ? "currentColor" : "none"} className="mr-2 h-4 w-4" />
                      <span>{project.featured ? "Unfeature" : "Feature"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center text-destructive"
                      onClick={() => openDeleteDialog(project)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags &&
                  project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 text-xs bg-muted rounded-full">
                      {tag}
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg font-medium">No projects found</div>
          <p className="text-foreground/70">Try adjusting your search or add a new project.</p>
        </div>
      )}

      {/* Add/Edit Project Dialog */}
      {isDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
      <h2 className="text-xl font-bold mb-4">
        {currentProject ? "Edit Project" : "Add New Project"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            required
          />
        </div>

        <div>
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="React, Firebase, Tailwind CSS"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="demoUrl">Demo URL</Label>
            <Input id="demoUrl" name="demoUrl" value={formData.demoUrl} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="repoUrl">Repository URL</Label>
            <Input id="repoUrl" name="repoUrl" value={formData.repoUrl} onChange={handleInputChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="image">Project Image</Label>
          <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
          {currentProject?.image && !formData.image && (
            <p className="text-xs text-foreground/70">Current image will be kept if no new image is selected.</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            name="featured"
            checked={formData.featured}
            onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
          />
          <Label htmlFor="featured">Feature this project on homepage</Label>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="bg-pink-500 text-white hover:bg-pink-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span>{currentProject ? "Update Project" : "Add Project"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}
     {/* Delete Confirmation Dialog */}
     {isDeleteDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg w-full max-w-md p-6 relative">
      <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p className="mb-6">
        Are you sure you want to delete the project "<strong>{currentProject?.title}</strong>"? This action cannot be undone.
      </p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
          Cancel
        </Button>
        <Button variant="destructive" className=" hover:bg-destructive/90 bg-red-600 text-white" onClick={handleDeleteConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Deleting...
            </span>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  </div>
)}
    </div>
  )
}
