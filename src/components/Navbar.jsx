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
  const [loading, setLoading] = useState(true); // 🔥 loading state

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
    <nav className="bg-[#020617] backdrop-blur-lg border-b border-white/10 text-white px-8 py-4 flex justify-between items-center shadow-lg">

      {/* 🔥 LOGO */}
      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
        HostelMS
      </h2>

      <div className="flex gap-6 items-center">

        {/* NAV LINKS */}
        <Link className="hover:text-purple-400 transition" to="/">Home</Link>

        <SignedIn>

          {user?.role === "admin" && (
            <>
              <Link className="hover:text-purple-400 transition" to="/complaints">Complaints</Link>
              <Link className="hover:text-purple-400 transition" to="/admin">Admin</Link>
              <Link className="hover:text-purple-400 transition" to="/fees">Fees</Link>
              <Link className="hover:text-purple-400 transition" to="/requests">All Requests</Link>
            </>
          )}

          {user?.role === "student" && (
            <>
              <Link className="hover:text-purple-400 transition" to="/complaints">My Complaints</Link>
              <Link className="hover:text-purple-400 transition" to="/complaint">Add Complaint</Link>
              <Link className="hover:text-purple-400 transition" to="/fees">Fees</Link>
              <Link className="hover:text-purple-400 transition" to="/payments">Payments</Link>
            </>
          )}

        </SignedIn>

        <SignedOut>
          <SignInButton>
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg shadow hover:opacity-90 transition">
              Login
            </button>
          </SignInButton>
        </SignedOut>

        {/* PROFILE */}
        <SignedIn>
          <div className="relative">

            {/* 🔄 LOADING SKELETON */}
            {loading ? (
              <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse"></div>
            ) : (
              <img
                src={user?.profileImage || "https://via.placeholder.com/40"}
                alt="profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-purple-500 hover:scale-105 transition"
                onClick={() => setOpen(!open)}
              />
            )}

            {/* DROPDOWN */}
            {open && !loading && (
              <div className="absolute right-0 mt-3 w-44 bg-[#0f172a]/90 backdrop-blur-lg border border-white/10 rounded-xl shadow-xl overflow-hidden">

                <button
                  onClick={() => {
                    navigate("/profile");
                    setOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-purple-600/20 transition"
                >
                  Profile
                </button>

                <button
                  onClick={() => signOut()}
                  className="block w-full text-left px-4 py-3 hover:bg-red-500/20 transition"
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        </SignedIn>

      </div>

    </nav>
  );
}

export default Navbar;