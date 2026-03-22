import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  useClerk
} from "@clerk/clerk-react";

import { useEffect, useState } from "react";
import API from "../services/api.js";

function Navbar() {
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false); // 🔥 NEW

  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await API.get("/students/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setUser(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [location.pathname]);

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-[#020617] backdrop-blur-lg border-b border-white/10 text-white px-6 md:px-8 py-4 flex justify-between items-center shadow-lg">

        {/* 🔥 LOGO (CLICKABLE IN MOBILE) */}
        <h2
          onClick={() => setSidebarOpen(true)}
          className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent cursor-pointer md:cursor-default"
        >
          HostelMS
        </h2>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-6 items-center">

          <Link className="hover:text-purple-400 transition" to="/">Home</Link>

          <SignedIn>
            {user?.role === "admin" && (
              <>
                <Link to="/complaints">Complaints</Link>
                <Link to="/admin">Admin</Link>
                <Link to="/fees">Fees</Link>
                <Link to="/requests">All Requests</Link>
              </>
            )}

            {user?.role === "student" && (
              <>
                <Link to="/complaints">My Complaints</Link>
                <Link to="/complaint">Add Complaint</Link>
                <Link to="/fees">Fees</Link>
                <Link to="/payments">Payments</Link>
              </>
            )}
          </SignedIn>

          <SignedOut>
            <SignInButton>
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg shadow">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          {/* PROFILE */}
          <SignedIn>
            <div className="relative">
              {loading ? (
                <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
              ) : (
                <img
                  src={user?.profileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-purple-500"
                  onClick={() => setOpen(!open)}
                />
              )}

              {open && !loading && (
                <div className="absolute right-0 mt-3 w-44 bg-[#0f172a]/90 border border-white/10 rounded-xl shadow-xl">
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 hover:bg-purple-600/20"
                  >
                    Profile
                  </button>

                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-3 hover:bg-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </SignedIn>
        </div>
      </nav>

      {/* 🔥 MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#020617] border-r border-white/10 z-50 transform transition-transform duration-300 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
      >
        <div className="p-6 flex flex-col gap-6">

          {/* CLOSE */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-right text-gray-400"
          >
            ✖
          </button>

          <Link onClick={() => setSidebarOpen(false)} to="/">Home</Link>

          {user?.role === "admin" && (
            <>
              <Link onClick={() => setSidebarOpen(false)} to="/complaints">Complaints</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/admin">Admin</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/fees">Fees</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/requests">All Requests</Link>
            </>
          )}

          {user?.role === "student" && (
            <>
              <Link onClick={() => setSidebarOpen(false)} to="/complaints">My Complaints</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/complaint">Add Complaint</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/fees">Fees</Link>
              <Link onClick={() => setSidebarOpen(false)} to="/payments">Payments</Link>
            </>
          )}

          <SignedOut>
            <SignInButton>
              <button className="bg-purple-600 px-4 py-2 rounded">
                Login
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <button
              onClick={() => {
                navigate("/profile");
                setSidebarOpen(false);
              }}
            >
              Profile
            </button>

            <button onClick={() => signOut()}>
              Logout
            </button>
          </SignedIn>

        </div>
      </div>

      {/* 🔥 OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        ></div>
      )}
    </>
  );
}

export default Navbar;