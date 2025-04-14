"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Sparkles } from "lucide-react"

export default function SkillsSection() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [hoveredSkill, setHoveredSkill] = useState(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const skillQuotes = {
    React: "Where every problem can be solved with another component",
    JavaScript: "Making the web weird since 1995",
    TypeScript: "Because sometimes, any isn't good enough",
    CSS: "The art of fighting with layouts until 3 AM",
    HTML: "The backbone of the web, with occasional back pain",
    "Node.js": "JavaScript, but make it server-side",
    "Next.js": "React, but with superpowers",
    Tailwind: "Writing CSS without actually writing CSS",
  }

  // Define skill categories
  const skillCategories = {
    "Frontend Development": ["React", "Next.js", "JavaScript", "TypeScript", "HTML", "CSS", "Tailwind CSS"],
    "UI/UX & Design": ["Figma", "Responsive Design", "Animation", "Accessibility", "Design Systems"],
    "Tools & Workflow": ["Git", "GitHub", "CI/CD", "Jest", "Testing Library", "Webpack", "Vite"],
    "State Management": ["Redux", "Context API", "Zustand", "Recoil"],
    "Backend Knowledge": ["Node.js", "Express", "RESTful APIs", "GraphQL", "Firebase", "MongoDB"],
    "Performance & SEO": ["Web Vitals", "Lighthouse", "Performance Optimization", "SEO"],
  }

  useEffect(() => {
    async function fetchSkills() {
      try {
        const skillsCollection = collection(db, "skills")
        const skillsSnapshot = await getDocs(skillsCollection)
        const skillsList = skillsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setSkills(skillsList)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Group skills by category
  const getSkillsByCategory = () => {
    const categorizedSkills = {}

    // Initialize categories
    Object.keys(skillCategories).forEach((category) => {
      categorizedSkills[category] = []
    })

    // Add "Other" category for skills that don't fit predefined categories
    categorizedSkills["Other"] = []

    // Sort skills into categories
    skills.forEach((skill) => {
      let found = false

      for (const [category, categorySkills] of Object.entries(skillCategories)) {
        if (
          categorySkills.some(
            (catSkill) =>
              skill.name.toLowerCase().includes(catSkill.toLowerCase()) ||
              catSkill.toLowerCase().includes(skill.name.toLowerCase()),
          )
        ) {
          categorizedSkills[category].push(skill)
          found = true
          break
        }
      }

      if (!found) {
        categorizedSkills["Other"].push(skill)
      }
    })

    // Remove empty categories
    Object.keys(categorizedSkills).forEach((category) => {
      if (categorizedSkills[category].length === 0) {
        delete categorizedSkills[category]
      }
    })

    return categorizedSkills
  }

  const categorizedSkills = getSkillsByCategory()

  if (loading) {
    return (
      <section id="skills" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-center mb-12">
              <div className="h-px w-12 bg-primary mr-4"></div>
              <h2 className="text-3xl font-bold">
                My <span className="pink-gradient-text">Skills</span>
              </h2>
              <div className="h-px w-12 bg-primary ml-4"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-background rounded-lg border border-border p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="h-8 bg-muted rounded-full w-20"></div>
                    ))}
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
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center mb-12">
            <div className="h-px w-12 bg-primary mr-4"></div>
            <h2 className="text-3xl font-bold">
              Skills <span className="pink-gradient-text">& Expertise</span>
            </h2>
            <div className="h-px w-12 bg-primary ml-4"></div>
          </div>

          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(categorizedSkills).map(([category, categorySkills]) => (
              <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.random() * 0.3 }} className="bg-background rounded-lg border border-border p-6 hover:border-[#ec489950] transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="relative group"
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                    >
                      <div
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-300
                          ${
                            category === "Frontend Development"
                              ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/30"
                              : category === "UI/UX & Design"
                                ? "bg-[#ec489915] text-[#ec4899] hover:bg-[#ec489925]"
                                : category === "Backend Knowledge"
                                  ? "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/30"
                                  : category === "Tools & Workflow"
                                    ? "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800/30"
                                    : category === "State Management"
                                      ? "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800/30"
                                      : category === "Performance & SEO"
                                        ? "bg-teal-100 dark:bg-teal-900/20 text-teal-700 dark:text-teal-300 hover:bg-teal-200 dark:hover:bg-teal-800/30"
                                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                      >
                        <span className="flex items-center">
                          {skill.name}
                          {hoveredSkill === skill.name && skillQuotes[skill.name] && (
                            <Sparkles className="ml-1 h-3 w-3 text-[#ec4899]" />
                          )}
                        </span>
                      </div>

                      {hoveredSkill === skill.name && skillQuotes[skill.name] && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-10 left-0 right-0 bg-background border border-[#ec489930] p-2 rounded text-xs italic z-10 shadow-sm min-w-[150px]"
                        >
                          {skillQuotes[skill.name]}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {skills.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-foreground/70">No skills found. Add some skills from your dashboard!</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 text-center"
          >
            <p className="text-foreground/70 max-w-2xl mx-auto mb-6">
              I'm constantly learning and expanding my skillset to stay up-to-date with the latest technologies and best
              practices in web development.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
