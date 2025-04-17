"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { PlusCircle, Search, MoreVertical, Eye, Edit, Trash, Star, Loader2, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { collection, getDocs, doc, addDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    url: "",
    readingTime: "",
    commentCount: 0,
    featured: false,
    coverImage: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const postsCollection = collection(db, "blogPosts")
      const postsSnapshot = await getDocs(postsCollection)
      const postsList = postsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        publishedAt: doc.data().publishedAt?.toDate() || new Date(),
      }))
      setPosts(postsList)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
      toast({
        title: "Error",
        description: "Failed to load blog posts. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleOpenDialog = (post = null) => {
    if (post) {
      setCurrentPost(post)
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        url: post.url || "",
        readingTime: post.readingTime || "",
        commentCount: post.commentCount || 0,
        featured: post.featured || false,
        coverImage: null,
      })
    } else {
      setCurrentPost(null)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        url: "",
        readingTime: "",
        commentCount: 0,
        featured: false,
        coverImage: null,
      })
    }
    setIsDialogOpen(true)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : type === "number" ? Number.parseInt(value) || 0 : value,
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        coverImage: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = currentPost?.coverImage || null

      // Upload image if a new one is selected
      if (formData.coverImage) {
        const storageRef = ref(storage, `blogPosts/${formData.coverImage.name}-${Date.now()}`)
        await uploadBytes(storageRef, formData.coverImage)
        imageUrl = await getDownloadURL(storageRef)
      }

      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        url: formData.url,
        readingTime: formData.readingTime,
        commentCount: formData.commentCount,
        featured: formData.featured,
        updatedAt: serverTimestamp(),
      }

      if (imageUrl) {
        postData.coverImage = imageUrl
      }

      if (currentPost) {
        // Update existing post
        await updateDoc(doc(db, "blogPosts", currentPost.id), postData)
        toast({
          title: "Blog post updated",
          description: "The blog post has been updated successfully.",
        })
      } else {
        // Add new post
        postData.publishedAt = serverTimestamp()
        postData.createdAt = serverTimestamp()
        await addDoc(collection(db, "blogPosts"), postData)
        toast({
          title: "Blog post added",
          description: "The new blog post has been added successfully.",
        })
      }

      setIsDialogOpen(false)
      fetchPosts()
    } catch (error) {
      console.error("Error saving blog post:", error)
      toast({
        title: "Error",
        description: "Failed to save blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!currentPost) return

    try {
      setIsSubmitting(true)
      await deleteDoc(doc(db, "blogPosts", currentPost.id))
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      })
      setIsDeleteDialogOpen(false)
      fetchPosts()
    } catch (error) {
      console.error("Error deleting blog post:", error)
      toast({
        title: "Error",
        description: "Failed to delete blog post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleFeatured = async (post) => {
    try {
      await updateDoc(doc(db, "blogPosts", post.id), {
        featured: !post.featured,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: post.featured ? "Blog post unfeatured" : "Blog post featured",
        description: `The blog post "${post.title}" has been ${post.featured ? "removed from" : "added to"} featured posts.`,
      })

      fetchPosts()
    } catch (error) {
      console.error("Error updating blog post:", error)
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (post) => {
    setCurrentPost(post)
    setIsDeleteDialogOpen(true)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
          <p className="mt-2 text-foreground/70">Loading blog posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-foreground/70">Manage your Hashnode articles</p>
        </div>
        <Button className="mt-4 sm:mt-0 text-white  bg-pink-500 hover:bg-pink-600" onClick={() => handleOpenDialog()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Article
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
            <div className="relative aspect-video">
              <Image
                src={post.coverImage || "/placeholder.svg?height=500&width=800"}
                alt={post.title}
                fill
                className="object-cover"
              />
              {post.featured && (
                <div className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded-md text-xs font-medium">
                  Featured
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-lg mb-1 truncate">{post.title}</h3>
                  <p className="text-foreground/70 text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-foreground/60 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    {post.readingTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readingTime} min read</span>
                      </div>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="flex items-center" asChild>
                      <a href={post.url} target="_blank" rel="noopener noreferrer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Article</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center" onClick={() => handleOpenDialog(post)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center" onClick={() => handleToggleFeatured(post)}>
                      <Star fill={post.featured ? "currentColor" : "none"} className="mr-2 h-4 w-4" />
                      <span>{post.featured ? "Unfeature" : "Feature"}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex items-center text-destructive"
                      onClick={() => openDeleteDialog(post)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-lg font-medium">No blog posts found</div>
          <p className="text-foreground/70">Try adjusting your search or add a new blog post.</p>
        </div>
      )}

      {/* Add/Edit Blog Post Dialog */}
      {isDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
      <h2 className="text-xl font-bold mb-4">
        {currentPost ? "Edit Blog Post" : "Add New Blog Post"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={3} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="url">Article URL</Label>
          <Input id="url" name="url" value={formData.url} onChange={handleInputChange} placeholder="https://..." required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="readingTime">Reading Time</Label>
            <Input id="readingTime" name="readingTime" value={formData.readingTime} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="commentCount">Comment Count</Label>
            <Input id="commentCount" name="commentCount" type="number" value={formData.commentCount} onChange={handleInputChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="coverImage">Cover Image</Label>
          <Input id="coverImage" name="coverImage" type="file" accept="image/*" onChange={handleFileChange} />
          {currentPost?.coverImage && !formData.coverImage && (
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
          <Label htmlFor="featured">Feature this article on homepage</Label>
        </div>
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" className="text-white bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </span>
            ) : (
              <span>{currentPost ? "Update Article" : "Add Article"}</span>
            )}
          </Button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Delete Confirmation Dialog */}
      {isDeleteDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
      <p className="text-foreground/80 mb-6">
        Are you sure you want to delete the article <strong>"{currentPost?.title}"</strong>? This action cannot be undone.
      </p>
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          className="bg-red-600 text-white hover:bg-destructive/90"
          onClick={handleDeleteConfirm}
          disabled={isSubmitting}
        >
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
