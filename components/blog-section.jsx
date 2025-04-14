"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { Calendar, Clock, ExternalLink, Heart, MessageSquare, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function BlogSection() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [likedPosts, setLikedPosts] = useState({})
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsCollection = collection(db, "blogPosts")
        const postsQuery = query(postsCollection, orderBy("publishedAt", "desc"), limit(6))
        const postsSnapshot = await getDocs(postsQuery)
        const postsList = postsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          publishedAt: doc.data().publishedAt?.toDate() || new Date(),
        }))
        setPosts(postsList)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  const handleLikePost = (id) => {
    setLikedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
      <section id="blog" className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px w-12 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold">
                My <span className="pink-gradient-text">Articles</span>
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
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted animate-pulse rounded w-24"></div>
                      <div className="h-4 bg-muted animate-pulse rounded w-16"></div>
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
    <section id="blog" className="py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="h-px w-12 bg-primary mr-4"></div>
            <h2 className="text-3xl font-bold">
              My <span className="pink-gradient-text">Articles</span>
            </h2>
            <div className="h-px w-10 bg-primary ml-4"></div>
          </div>

          <div className="text-center mb-12">
            <p className="text-foreground/70 max-w-2xl mx-auto">
              I share my knowledge and experiences through writing. Check out some of my articles on web
              development, and other technologies.
            </p>
          </div>

          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {posts.map((post) => (
              <motion.div
                key={post.id}
                variants={itemVariants}
                className="bg-background rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 group hover:border-[#ec489950] hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.coverImage || "/placeholder.svg?height=500&width=800"}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {post.featured && (
                    <div className="absolute top-2 left-2 bg-[#ec4899] text-white px-2 py-1 rounded-md text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="text-foreground/50 hover:text-[#ec4899] transition-colors ml-2 flex-shrink-0"
                      aria-label={`Like ${post.title}`}
                    >
                      <Heart className={`h-5 w-5 ${likedPosts[post.id] ? "fill-[#ec4899] text-[#ec4899]" : ""}`} />
                    </button>
                  </div>

                  <p className="text-sm text-foreground/70 mb-4 line-clamp-3 flex-1">{post.excerpt}</p>

                  <div className="flex justify-between items-center text-xs text-foreground/60 mt-auto">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {post.readingTime && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{post.readingTime} min read</span>
                        </div>
                      )}
                      {post.commentCount > 0 && (
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>{post.commentCount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-[#ec4899] transition-colors text-sm font-medium flex items-center justify-center gap-1 w-full"
                    >
                      <span>Read Article</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {posts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-foreground/70">No blog posts found. Add some posts from your dashboard!</p>
            </div>
          )}

          <div className="mt-12 text-center">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-[#ec4899] hover:opacity-90 bounce-on-hover">
              <a
                href="https://hashnode.com/@hassana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-white  gap-2"
              >
                <Eye className="h-4 w-4" />
                <span>View All Articles</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
