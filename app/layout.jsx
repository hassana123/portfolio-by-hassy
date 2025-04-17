import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Hassana Abdullahi | Front End Developer",
  description: "Personal portfolio and blog by Hassana Abdullahi",
    generator: 'Hassy'
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


