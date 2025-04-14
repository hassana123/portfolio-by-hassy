import { AuthProvider } from "@/contexts/auth-context"
import RouteGuard from "@/components/route-guard"
import { Sidebar } from "@/components/sidebar"

export default function DashboardLayout({ children }) {
  return (
    
      <RouteGuard>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1  md:ml-64 ml-[50px] ">{children}</div>
        </div>
      </RouteGuard>
 
  )
}
