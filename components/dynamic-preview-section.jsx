"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Check, LayoutDashboard, Settings, Notebook, ImageIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DynamicPreviewSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background">
      <div className="container mx-auto px-4">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-6xl mx-auto"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Fully <span className="text-primary">Customizable</span> Portfolio
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              This portfolio comes with an admin dashboard that allows me to easily manage all my content
              without touching any code.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Easily add, update, or remove projects</h3>
                  <p className="text-foreground/70">
                    Showcase your work with beautiful project cards. Add images, descriptions, tags, and links to live
                    demos and repositories.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Update your skills and expertise as you grow</h3>
                  <p className="text-foreground/70">
                    Keep your skill set current by easily adding new technologies and adjusting proficiency levels as
                    you learn and grow.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Edit your personal information and about section</h3>
                  <p className="text-foreground/70">
                    Customize your bio, contact information, and personal details to keep your portfolio up-to-date.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-2 mt-1">
                  <Check className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Upload and manage project images securely</h3>
                  <p className="text-foreground/70">
                    Easily upload, store, and manage images for your projects with secure cloud storage integration.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Button asChild className="bg-primary hover:bg-primary/50 text-white">
                  <a href="/login">Admin Login</a>
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="ml-2 text-xs text-gray-500 dark:text-gray-400">Dashboard / Projects</div>
                </div>
                <div className="p-4">
                  <div className="flex mb-6">
                    <div className="w-48 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mr-4">
                      <div className="flex items-center gap-2 mb-6 text-primary font-medium">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>Dashboard</span>
                      </div>
                      <div className="space-y-4 text-sm">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <FileText className="h-4 w-4" />
                          <span>Projects</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Settings className="h-4 w-4" />
                          <span>Skills</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <Notebook className="h-4 w-4" />
                          <span>Articles</span>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/70">
                          <ImageIcon className="h-4 w-4" />
                          <span>Others</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Projects</h3>
                        <div className="bg-primary text-white text-xs px-2 py-1 rounded">Add New</div>
                      </div>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded"></div>
                              <div>
                                <div className="text-sm font-medium">Project {i}</div>
                                <div className="text-xs text-foreground/60">Updated recently</div>
                              </div>
                            </div>
                            <div className="text-xs text-primary">Edit</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-gradient-to-br from-primary/20 to-blue-400/20 rounded-lg blur-lg"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
