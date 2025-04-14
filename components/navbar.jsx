"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Moon, Sun, Coffee, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { scrollToSection } from "./scroll-to-section"

const navItems = [
  { name: "Home", href: "hero" },
  { name: "About", href: "about" },
  { name: "Skills", href: "skills" },
  { name: "Projects", href: "projects" },
  { name: "Blog", href: "blog" },
  { name: "Contact", href: "contact" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [showEasterEgg, setShowEasterEgg] = useState(false)
  const [easterEggClicks, setEasterEggClicks] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    scrollToSection(sectionId)
    if (isOpen) setIsOpen(false)
  }

  const handleLogoClick = (e) => {
    e.preventDefault()
    scrollToSection("hero")
    setEasterEggClicks((prev) => prev + 1)

    if (easterEggClicks >= 4) {
      setShowEasterEgg(true)
      setTimeout(() => setShowEasterEgg(false), 3000)
      setEasterEggClicks(0)
    }
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : ""}`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" onClick={handleLogoClick} className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">Hassana</span>
            <span className="pink-gradient-text">.dev</span>
          </motion.div>

          <AnimatePresence>
            {showEasterEgg && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 mt-2 p-2 bg-background border border-[#ec489930] rounded-md shadow-md text-xs"
              >
                <div className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-[#ec4899]" />
                  <span>You found a secret! Keep clicking for more surprises!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <a
                href={`#${item.href}`}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-foreground/80 hover:text-[#ec4899] transition-colors relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ec4899] transition-all duration-300 group-hover:w-full"></span>
              </a>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="flex items-center gap-2"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="hover:bg-[#ec489915]"
            >
              {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-[#ec4899] hover:bg-[#ec489915] bounce-on-hover"
              onClick={() => scrollToSection("contact")}
            >
              <Coffee className="h-5 w-5" />
            </Button>
          </motion.div>
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="hover:bg-[#ec489915]"
          >
            {mounted && theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className={isOpen ? "text-[#ec4899]" : ""}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-lg"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <a
                  key={item.name}
                  href={`#${item.href}`}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="text-foreground/80 hover:text-[#ec4899] py-2 border-b border-border flex items-center"
                >
                  <span className="w-2 h-2 rounded-full bg-[#ec489950] mr-2"></span>
                  {item.name}
                </a>
              ))}
              <div className="pt-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-[#ec4899]" />
                <span className="text-sm text-foreground/60 italic">Let's work together!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
