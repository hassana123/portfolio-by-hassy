"use client"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import ProjectsSection from "@/components/projects-section"
import BlogSection from "@/components/blog-section"
import SkillsSection from "@/components/skills-section"
import ContactSection from "@/components/contact-section"
import DynamicPreviewSection from "@/components/dynamic-preview-section"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen w-[100%] bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <DynamicPreviewSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
