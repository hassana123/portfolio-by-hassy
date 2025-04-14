"use client"

import { Github, Heart, Linkedin, MessageSquare, Coffee } from "lucide-react"
import { scrollToSection } from "./scroll-to-section"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleNavClick = (e, sectionId) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-500 to-[#ec4899] bg-clip-text text-transparent">
                Hassana.dev
              </span>
            </h3>
            <p className="text-foreground/70 mb-4 max-w-xs">
              Frontend developer crafting beautiful, functional websites and applications with clean code and creative
              solutions.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/hassana-coder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="bounce-on-hover"
              >
                <Github className="h-5 w-5 text-foreground/60 hover:text-primary transition-colors" />
              </a>
              <a
                href="https://linkedin.com/in/hassana-abdullahi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="bounce-on-hover"
              >
                <Linkedin className="h-5 w-5 text-foreground/60 hover:text-primary transition-colors" />
              </a>
              <a
                href="https://hashnode.com/@hassana"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Hashnode"
                className="bounce-on-hover"
              >
                <MessageSquare className="h-5 w-5 text-foreground/60 hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleNavClick(e, "hero")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  onClick={(e) => handleNavClick(e, "about")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>About</span>
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  onClick={(e) => handleNavClick(e, "skills")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>Skills</span>
                </a>
              </li>
              <li>
                <a
                  href="#projects"
                  onClick={(e) => handleNavClick(e, "projects")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>Projects</span>
                </a>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(e) => handleNavClick(e, "blog")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>Blog</span>
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleNavClick(e, "contact")}
                  className="text-foreground/70 hover:text-[#ec4899] transition-colors flex items-center gap-1 group"
                >
                  <span className="w-0 h-px bg-[#ec4899] transition-all duration-300 group-hover:w-2"></span>
                  <span>Contact</span>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Latest Blog Posts</h3>
            <ul className="space-y-4">
              <li>
                <a href="#blog" onClick={(e) => handleNavClick(e, "blog")} className="group">
                  <h4 className="text-sm font-medium group-hover:text-[#ec4899] transition-colors">
                    Building Responsive UIs with Tailwind CSS
                  </h4>
                  <p className="text-xs text-foreground/60">March 15, 2023</p>
                </a>
              </li>
              <li>
                <a href="#blog" onClick={(e) => handleNavClick(e, "blog")} className="group">
                  <h4 className="text-sm font-medium group-hover:text-[#ec4899] transition-colors">
                    React Performance Optimization Techniques
                  </h4>
                  <p className="text-xs text-foreground/60">February 28, 2023</p>
                </a>
              </li>
              <li>
                <a href="#blog" onClick={(e) => handleNavClick(e, "blog")} className="group">
                  <h4 className="text-sm font-medium group-hover:text-[#ec4899] transition-colors">
                    Getting Started with Next.js 13
                  </h4>
                  <p className="text-xs text-foreground/60">February 10, 2023</p>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border text-center">
          <p className="text-foreground/60 flex items-center justify-center gap-1 flex-wrap">
            <span>&copy; {currentYear} Hassana Abdullahi. All rights reserved.</span>
            <span className="flex items-center">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-[#ec4899] mx-1 inline-block" />
              <span>and</span>
              <Coffee className="h-4 w-4 text-primary mx-1 inline-block" />
            </span>
          </p>
          <p className="text-xs text-foreground/40 mt-2 italic">
            "Why do programmers prefer dark mode? Because light attracts bugs!"
          </p>
        </div>
      </div>
    </footer>
  )
}
