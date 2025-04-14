"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { FolderIcon, Home, ImageIcon, LogOut, Menu, Settings, User, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/dashboard",
  },
  {
    title: "Profile",
    icon: User,
    path: "/dashboard/profile",
  },
  {
    title: "Projects",
    icon: FolderIcon,
    path: "/dashboard/projects",
  },
  {
    title: "Blog Posts",
    icon: FileText,
    path: "/dashboard/blog",
  },
  {
    title: "Skills",
    icon: Settings,
    path: "/dashboard/skills",
  },
  {
    title: "Gallery",
    icon: ImageIcon,
    path: "/dashboard/gallery",
  },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { signOut } = useAuth()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Toggle Button */}
      <Button variant="ghost" size="icon" onClick={toggleSidebar} className="fixed top-4 left-4 z-50 md:hidden">
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 bg-background border-r border-border z-50 md:translate-x-0 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <Link href="/">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                Hassana<span>.dev</span>
              </h2>
              <p className="text-xs text-foreground/70">Admin Dashboard</p>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.path

                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted group transition-colors ${
                        isActive
                          ? "bg-gradient-to-r from-blue-100 to-pink-100 dark:from-blue-900/20 dark:to-pink-900/20 text-foreground"
                          : "text-foreground/70"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-gradient-to-r from-blue-500 to-pink-500"
                            : "text-foreground/70 group-hover:text-foreground"
                        }`}
                        style={{
                          color: isActive ? (pathname === "/dashboard/blog" ? "#ec4899" : "#3b82f6") : "",
                        }}
                      />
                      <span>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full flex items-center gap-2 justify-start" onClick={signOut}>
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
