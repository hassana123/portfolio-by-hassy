"use client"

import { useRef, useEffect } from "react"
import { useTheme } from "@/components/theme-provider"

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    let particles = []
    const particleCount = 100
    const connectionDistance = 100
    const mousePosition = { x: 0, y: 0 }

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    // Initialize particles
    const initParticles = () => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: Math.random() * 0.5 - 0.25,
          speedY: Math.random() * 0.5 - 0.25,
          color: theme === "dark" ? "rgba(150, 150, 150, 0.5)" : "rgba(100, 100, 100, 0.5)",
        })
      }
    }

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePosition.x = event.clientX
      mousePosition.y = event.clientY
    }

    // Draw particles and connections
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) {
          particle.speedX *= -1
        }
        if (particle.y < 0 || particle.y > canvas.height) {
          particle.speedY *= -1
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const dx = particle.x - otherParticle.x
            const dy = particle.y - otherParticle.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            if (distance < connectionDistance) {
              ctx.beginPath()
              ctx.strokeStyle = `rgba(100, 100, 100, ${1 - distance / connectionDistance})`
              ctx.lineWidth = 0.5
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(otherParticle.x, otherParticle.y)
              ctx.stroke()
            }
          }
        })

        // Draw connections to mouse
        const dx = particle.x - mousePosition.x
        const dy = particle.y - mousePosition.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance * 2) {
          ctx.beginPath()
          ctx.strokeStyle = `rgba(100, 100, 255, ${1 - distance / (connectionDistance * 2)})`
          ctx.lineWidth = 0.8
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mousePosition.x, mousePosition.y)
          ctx.stroke()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    // Set up event listeners
    window.addEventListener("resize", setCanvasDimensions)
    window.addEventListener("mousemove", handleMouseMove)

    // Initialize
    setCanvasDimensions()
    animate()

    // Clean up
    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
}
