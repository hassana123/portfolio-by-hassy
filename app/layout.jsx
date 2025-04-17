import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hassana Abdullahi | Front-End Developer",
  description: "Explore the personal portfolio, blog, and projects by Hassana Abdullahi, a passionate Front-End Developer specializing in React, TypeScript, and modern web design.",
  keywords: [
    "Hassana Abdullahi",
    "Front-End Developer",
    "React Developer",
    "TypeScript",
    "JavaScript",
    "Web Developer Portfolio",
    "UI/UX Designer",
    "Frontend Engineer",
    "Tailwind CSS",
    "Next.js"
  ],
  authors: [{ name: "Hassana Abdullahi", url: "https://portfolio-by-hassy.vercel.app/" }],
  creator: "Hassana Abdullahi",
  publisher: "Hassana Abdullahi",
  metadataBase: new URL("https://portfolio-by-hassy.vercel.app/"),
  openGraph: {
    title: "Hassana Abdullahi | Front-End Developer",
    description: "Personal portfolio and blog by Hassana Abdullahi",
    url: "https://portfolio-by-hassy.vercel.app/",
    siteName: "Hassana Abdullahi",
    images: [
      {
        url: "./hassy.JPEG", // replace with your actual OG image URL
        width: 1200,
        height: 630,
        alt: "Hassana Abdullahi - Front-End Developer Portfolio"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Hassana Abdullahi | Front-End Developer",
    description: "Personal portfolio and blog by Hassana Abdullahi",
    creator: "@techSultana",
    images: ["https://pbs.twimg.com/profile_images/1890754622807019520/vsmubyFs_400x400.jpg"]
  },
  generator: "Hassy"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning  className={`${inter.className}`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <AuthProvider>
          {children}
        </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}


