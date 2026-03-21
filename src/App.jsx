import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/clerk-react";

import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Complaints from "./pages/Complaints";
import Fees from "./pages/Fees";
import AdminPanel from "./pages/AdminPanel";
import RoomDetails from "./pages/RoomDetails";
import ComplaintForm from "./pages/ComplaintForm";
import PaymentHistory from "./pages/PaymentHistory";
import Footer from "./components/Footer";
import RoomRequests from "./pages/RoomRequest";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname.startsWith("/sign-in") ||
    location.pathname.startsWith("/sign-up");

  return (
    <div className="flex flex-col min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* 🌌 BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none z-0"></div>

      {/* 🔝 NAVBAR */}
      {!hideNavbar && (
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
      )}

      {/* 🔥 MAIN */}
      <main className="flex-grow px-6 py-10 relative z-10 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/complaints" element={<Complaints />} />
          <Route path="/complaint" element={<ComplaintForm />} />
          <Route path="/fees" element={<Fees />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/payments" element={<PaymentHistory />} />
           <Route path="/requests" element={<RoomRequests />} />

          {/* 🔐 SIGN IN */}
          <Route
            path="/sign-in/*"
            element={
              <div className="flex justify-center items-center min-h-screen relative z-10">
                <SignIn
                  appearance={{
                    baseTheme: "dark",
                    variables: {
                      colorPrimary: "#6366f1",
                      colorBackground: "#020617",
                      colorInputBackground: "#0f172a",
                      colorInputText: "#ffffff",
                      colorText: "#e2e8f0"
                    },
                    elements: {
                      card: "bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl",
                      headerTitle: "text-white",
                      headerSubtitle: "text-gray-400",
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90",
                      formFieldInput:
                        "bg-white/10 border border-white/20 text-white placeholder-gray-400",
                      footerActionLink:
                        "text-indigo-400 hover:text-purple-400",
                      socialButtonsBlockButton:
                      "bg-white/10 border border-white/20 text-white hover:bg-white/20",
                    }
                  }}
                />
              </div>
            }
          />

          {/* 🔐 SIGN UP */}
          <Route
            path="/sign-up/*"
            element={
              <div className="flex justify-center items-center min-h-screen relative z-10">
                <SignUp
                  appearance={{
                    baseTheme: "dark",
                    variables: {
                      colorPrimary: "#6366f1",
                      colorBackground: "#020617",
                      colorInputBackground: "#0f172a",
                      colorInputText: "#ffffff",
                      colorText: "#e2e8f0"
                    },
                    elements: {
                      card: "bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 shadow-2xl",
                      headerTitle: "text-white",
                      headerSubtitle: "text-gray-400",
                      formButtonPrimary:
                        "bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90",
                      formFieldInput:
                        "bg-white/10 border border-white/20 text-white placeholder-gray-400",
                      footerActionLink:
                        "text-indigo-400 hover:text-purple-400"
                    }
                  }}
                />
              </div>
            }
          />
        </Routes>
      </main>

      {/* 🔻 FOOTER */}
      {!hideNavbar && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;