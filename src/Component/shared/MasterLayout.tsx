import { useState, useCallback, useEffect } from "react"
import Navbar from "../shared/Navbar"
import Sidebar from "../shared/Sidebar"
import { Outlet } from "react-router-dom"


export default function MasterLayout() {
const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
  const stored = localStorage.getItem("sidebarOpen");
  return stored ? stored === "true" : false;
});

  const handleMenuToggle = useCallback(() => {
    setIsSidebarOpen((prev) => !prev)
  }, [])

  const handleSidebarClose = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

 useEffect(() => {
    localStorage.setItem("sidebarOpen", String(isSidebarOpen));
  }, [isSidebarOpen]);



  return (
    <div className="flex h-screen layout bg-gray-50">
      <Sidebar onMenuToggle={handleMenuToggle} isOpen={isSidebarOpen} isSidebarOpen={isSidebarOpen} onClose={handleSidebarClose} />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuToggle={handleMenuToggle} />

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
        <Outlet/>
        </main>
      </div>
    </div>
  )
}
