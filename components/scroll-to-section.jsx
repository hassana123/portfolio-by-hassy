"use client"

export function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId)
  if (section) {
    // Get the height of the fixed navbar
    const navbar = document.querySelector("header")
    const navbarHeight = navbar ? navbar.offsetHeight : 0

    // Calculate the position to scroll to (accounting for navbar height)
    const sectionPosition = section.getBoundingClientRect().top + window.pageYOffset
    const offsetPosition = sectionPosition - navbarHeight - 20 // 20px extra padding

    // Scroll to the section
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}
