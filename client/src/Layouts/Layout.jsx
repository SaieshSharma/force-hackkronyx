import { Outlet, useNavigate } from "react-router-dom"
import UserHeader from "../components/Header/UserHeader"
import Navigation from "../components/Navigation/Navigation"
import UserFooter from "../components/Footer/UserFooter"

const Layout = () => {
  const navigate = useNavigate()

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear authentication token
    console.log("User signed out");
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <UserHeader onSignOut={handleSignOut} />
      <Navigation />

      <main className="flex-1 md:ml-64 pt-6 pb-12">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>

      <UserFooter />
    </div>
  )
}

export default Layout

