"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowDown, Github, Linkedin, MessageSquare, Notebook, NotebookIcon,  Twitter, Sparkles, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import ParticleCanvas from "./particle-canvas"
import { scrollToSection } from "./scroll-to-section"

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)
  const [funFact, setFunFact] = useState("")
  const [showFunFact, setShowFunFact] = useState(false)

  const funFacts = [
    "I debug with console.log and prayer 🙏",
    "My code works? Don't touch it! 🤫",
    "I speak fluent JavaScript, HTML, CSS, and sarcasm 😏",
    "My favorite HTTP status code is 418: I'm a teapot ☕",
    "I don't always test my code, but when I do, I do it in production 😎",
    "CSS is my cardio 🏃‍♀️",
    "I'm not lazy, I'm on energy-saving mode ⚡",
  ]

  useEffect(() => {
    setMounted(true)
    setFunFact(funFacts[Math.floor(Math.random() * funFacts.length)])
  }, [])
  const handleFunFactToggle = () => {
    if (!showFunFact) {
      const newFact = funFacts[Math.floor(Math.random() * funFacts.length)]
      setFunFact(newFact)
      setShowFunFact(true)
    } else {
      setShowFunFact(false)
    }
  }
  if (!mounted) return null

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* <ParticleCanvas /> */}
      <div className="container mx-auto px-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-[#ec489915] border border-[#ec489930]">
              <Sparkles className="h-4 w-4 text-[#ec4899]" />
              <span className="text-sm font-medium">Frontend Developer</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Hi, I'm <span className="text-primary">Hassana</span>{" "}
              <span className="pink-gradient-text">Abdullahi</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-foreground/80 mb-6">
              <span className="inline-block">
                Crafting digital experiences with <span className="pink-gradient-text">passion</span>
              </span>
            </h2>

            <p className="text-foreground/70 mb-8 max-w-xl">
              I build exceptional and accessible digital experiences for the web. Specializing in React, JavaScript, and
              Node.js to create fast, responsive, and beautiful applications.
            </p>

            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                className="bg-primary text-white hover:bg-primary/90 bounce-on-hover"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("projects")
                }}
              >
                View My Work
              </Button>
              <Button
                variant="outline"
                className="border-[#ec489950] hover:border-[#ec4899] hover:bg-[#ec489910] bounce-on-hover"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection("contact")
                }}
              >
                Contact Me <MessageSquare className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-[#ec4899] hover:bg-[#ec489915] bounce-on-hover"
                onClick={handleFunFactToggle}
              >
                <Coffee className="h-5 w-5" />
              </Button>
            </div>

            {showFunFact && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 mb-6 bg-[#ec489910] border border-[#ec489930] rounded-lg text-sm italic"
              >
                <p>{funFact}</p>
              </motion.div>
            )}

            <div className="flex space-x-4">
            <motion.a
                href="https://x.com/techSultana"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-background hover:bg-muted p-2 rounded-full"
              >
                <Twitter className="h-6 w-6" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="https://github.com/hassana123"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-background hover:bg-muted p-2 rounded-full"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/hassana-abdullahi-858040240/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="bg-background hover:bg-muted p-2 rounded-full"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              <motion.a
                href="https://hashnode.com/@TechSultana"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-background hover:bg-muted p-2 rounded-full"
              >
                <NotebookIcon className="h-6 w-6" />
                <span className="sr-only">Hashnode</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative mx-auto w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-300 via-[#ec4899] to-blue-500 opacity-20 blur-3xl"></div>
              <div className="relative z-10 w-full h-full rounded-full border-2 border-blue-500/30 overflow-hidden">
                <Image
                  src="./placeholder.svg"
                  alt="Hassana Abdullahi"
                  width={600}
                  height={600}
                  priority
                  className="object-cover"
                />
              </div>

              {/* Decorative elements */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className={`absolute w-20 h-20 rounded-full ${i % 2 === 0 ? "bg-blue-500/10" : "bg-[#ec4899]/10"}`}
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    x: [0, 30, 0],
                    y: [0, 30, 0],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 5 + i,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <p className="text-sm text-foreground/50 mb-2">Scroll to explore</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            onClick={() => scrollToSection("about")}
            className="cursor-pointer bg-[#ec489915] hover:bg-[#ec489930] p-2 rounded-full"
          >
            <ArrowDown className="h-5 w-5 text-[#ec4899]" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
