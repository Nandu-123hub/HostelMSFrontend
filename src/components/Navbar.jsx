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
                src={user?.profileImage || "data:image/png;base64,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"}
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